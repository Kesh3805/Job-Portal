import Company from '../models/Company.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, industry, size } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    if (size) {
      query.size = size;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const companies = await Company.find(query)
      .populate('owner', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: companies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers.user', 'name email avatar');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create company
// @route   POST /api/companies
// @access  Private (Recruiter)
export const createCompany = async (req, res, next) => {
  try {
    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: req.user.id });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'You already have a company profile'
      });
    }

    req.body.owner = req.user.id;

    const company = await Company.create(req.body);

    // Update user's company reference
    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Recruiter/Owner)
export const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Recruiter/Owner/Admin)
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this company'
      });
    }

    await company.deleteOne();

    // Remove company reference from user
    await User.findByIdAndUpdate(req.user.id, { company: null });

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   PUT /api/companies/:id/logo
// @access  Private (Recruiter/Owner)
export const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    // Delete old logo file if exists
    if (company.logo?.publicId) {
      const oldFilePath = path.join(__dirname, '..', 'uploads', 'logos', company.logo.publicId);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    company.logo = {
      url: `/uploads/logos/${req.file.filename}`,
      publicId: req.file.filename
    };

    await company.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: company.logo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my company
// @route   GET /api/companies/my-company
// @access  Private (Recruiter)
export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user.id })
      .populate('teamMembers.user', 'name email avatar');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};
