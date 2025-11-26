import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

// Calculate similarity between job and user profile
export const calculateJobMatch = (job, userProfile) => {
  try {
    // Extract relevant text from job
    const jobText = [
      job.title,
      job.description,
      ...(job.skills || []),
      ...(job.requirements || [])
    ].join(' ').toLowerCase();

    // Extract relevant text from user profile
    const userText = [
      userProfile.bio || '',
      ...(userProfile.skills || []),
      ...(userProfile.experience?.map(exp => `${exp.title} ${exp.description}`) || [])
    ].join(' ').toLowerCase();

    // Calculate TF-IDF
    const tfidf = new TfIdf();
    tfidf.addDocument(jobText);
    tfidf.addDocument(userText);

    // Get terms from both documents
    const jobTerms = tokenizer.tokenize(jobText);
    const userTerms = tokenizer.tokenize(userText);

    // Calculate common skills match
    const jobSkills = new Set((job.skills || []).map(s => s.toLowerCase()));
    const userSkills = new Set((userProfile.skills || []).map(s => s.toLowerCase()));
    const commonSkills = [...jobSkills].filter(s => userSkills.has(s));
    
    const skillMatchScore = jobSkills.size > 0 ? (commonSkills.length / jobSkills.size) * 100 : 0;

    // Calculate term overlap
    const jobTermSet = new Set(jobTerms);
    const userTermSet = new Set(userTerms);
    const commonTerms = [...jobTermSet].filter(t => userTermSet.has(t));
    
    const termMatchScore = jobTermSet.size > 0 ? (commonTerms.length / jobTermSet.size) * 100 : 0;

    // Weighted average (skills are more important)
    const matchScore = (skillMatchScore * 0.7 + termMatchScore * 0.3);

    return {
      score: Math.round(matchScore),
      matchedSkills: commonSkills,
      totalSkills: jobSkills.size,
      matchedTerms: commonTerms.length
    };
  } catch (error) {
    console.error('Job matching error:', error);
    return { score: 0, matchedSkills: [], totalSkills: 0, matchedTerms: 0 };
  }
};

// Get recommended jobs for user
export const getRecommendedJobs = async (jobs, userProfile, threshold = 30) => {
  const recommendedJobs = [];

  for (const job of jobs) {
    const match = calculateJobMatch(job, userProfile);
    if (match.score >= threshold) {
      recommendedJobs.push({
        job,
        matchScore: match.score,
        matchedSkills: match.matchedSkills
      });
    }
  }

  // Sort by match score
  recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

  return recommendedJobs;
};

// Extract keywords from text
export const extractKeywords = (text, limit = 10) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(text.toLowerCase());

  const keywords = [];
  tfidf.listTerms(0).slice(0, limit).forEach(item => {
    keywords.push(item.term);
  });

  return keywords;
};
