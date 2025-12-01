import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiSave, FiSettings, FiMail, FiShield, FiBell, FiDollarSign } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'JobPortal',
      siteDescription: 'Connect with opportunities and build your career',
      supportEmail: 'support@jobportal.com',
      requireJobApproval: true,
      requireEmailVerification: true,
      allowPublicJobView: true
    },
    notifications: {
      emailNotifications: true,
      applicationNotifications: true,
      jobApprovalNotifications: true,
      weeklyDigest: false
    },
    security: {
      passwordMinLength: 6,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      requireStrongPassword: false,
      twoFactorAuth: false
    },
    fees: {
      jobPostingFee: 0,
      featuredJobFee: 49,
      resumeHighlightFee: 9,
      currency: 'USD'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/admin/settings');
      if (data.data) {
        setSettings(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/admin/settings', settings);
      toast.success('Settings saved successfully');
      setSaving(false);
    } catch (error) {
      toast.error('Failed to save settings');
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Platform Settings</h1>
            <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} isLoading={saving}>
              <FiSave className="mr-2" /> Save Changes
            </Button>
            <Link to="/admin/dashboard">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiSettings className="text-primary" /> General Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
                <textarea
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  rows="3"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Support Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  value={settings.general.supportEmail}
                  onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary rounded border-border"
                    checked={settings.general.requireJobApproval}
                    onChange={(e) => updateSetting('general', 'requireJobApproval', e.target.checked)}
                  />
                  <div>
                    <span className="text-foreground font-medium">Require Job Approval</span>
                    <p className="text-sm text-muted-foreground">All jobs must be approved before going live</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary rounded border-border"
                    checked={settings.general.requireEmailVerification}
                    onChange={(e) => updateSetting('general', 'requireEmailVerification', e.target.checked)}
                  />
                  <div>
                    <span className="text-foreground font-medium">Require Email Verification</span>
                    <p className="text-sm text-muted-foreground">Users must verify email before full access</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary rounded border-border"
                    checked={settings.general.allowPublicJobView}
                    onChange={(e) => updateSetting('general', 'allowPublicJobView', e.target.checked)}
                  />
                  <div>
                    <span className="text-foreground font-medium">Allow Public Job Viewing</span>
                    <p className="text-sm text-muted-foreground">Non-registered users can view job listings</p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiBell className="text-primary" /> Notification Settings
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-border"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                />
                <div>
                  <span className="text-foreground font-medium">Email Notifications</span>
                  <p className="text-sm text-muted-foreground">Enable email notifications for users</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-border"
                  checked={settings.notifications.applicationNotifications}
                  onChange={(e) => updateSetting('notifications', 'applicationNotifications', e.target.checked)}
                />
                <div>
                  <span className="text-foreground font-medium">Application Notifications</span>
                  <p className="text-sm text-muted-foreground">Notify users of application status changes</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-border"
                  checked={settings.notifications.jobApprovalNotifications}
                  onChange={(e) => updateSetting('notifications', 'jobApprovalNotifications', e.target.checked)}
                />
                <div>
                  <span className="text-foreground font-medium">Job Approval Notifications</span>
                  <p className="text-sm text-muted-foreground">Notify recruiters of job approval status</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-border"
                  checked={settings.notifications.weeklyDigest}
                  onChange={(e) => updateSetting('notifications', 'weeklyDigest', e.target.checked)}
                />
                <div>
                  <span className="text-foreground font-medium">Weekly Digest</span>
                  <p className="text-sm text-muted-foreground">Send weekly activity summaries to users</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiShield className="text-primary" /> Security Settings
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Min Password Length</label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary rounded border-border"
                    checked={settings.security.requireStrongPassword}
                    onChange={(e) => updateSetting('security', 'requireStrongPassword', e.target.checked)}
                  />
                  <div>
                    <span className="text-foreground font-medium">Require Strong Password</span>
                    <p className="text-sm text-muted-foreground">Password must contain uppercase, lowercase, number, and special character</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary rounded border-border"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                  />
                  <div>
                    <span className="text-foreground font-medium">Enable Two-Factor Authentication</span>
                    <p className="text-sm text-muted-foreground">Require 2FA for enhanced security</p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Fee Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiDollarSign className="text-primary" /> Fee Settings
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Job Posting Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{settings.fees.currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-14 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      value={settings.fees.jobPostingFee}
                      onChange={(e) => updateSetting('fees', 'jobPostingFee', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Featured Job Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{settings.fees.currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-14 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      value={settings.fees.featuredJobFee}
                      onChange={(e) => updateSetting('fees', 'featuredJobFee', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Resume Highlight Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{settings.fees.currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-14 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      value={settings.fees.resumeHighlightFee}
                      onChange={(e) => updateSetting('fees', 'resumeHighlightFee', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                  <select
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                    value={settings.fees.currency}
                    onChange={(e) => updateSetting('fees', 'currency', e.target.value)}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link to="/admin/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave} isLoading={saving}>
            <FiSave className="mr-2" /> Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
