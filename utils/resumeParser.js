import compromise from 'compromise';

// Parse resume text and extract structured data
export const parseResume = (text) => {
  try {
    const doc = compromise(text);
    
    // Extract email
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const emails = text.match(emailRegex) || [];

    // Extract phone numbers
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex) || [];

    // Extract skills (common programming languages and technologies)
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
      'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'azure',
      'docker', 'kubernetes', 'git', 'agile', 'scrum', 'html', 'css',
      'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift'
    ];

    const lowerText = text.toLowerCase();
    const foundSkills = commonSkills.filter(skill => 
      lowerText.includes(skill.toLowerCase())
    );

    // Extract education keywords
    const educationKeywords = ['university', 'college', 'bachelor', 'master', 'phd', 'degree'];
    const educationSections = [];
    
    educationKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const sentences = doc.sentences().out('array');
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword)) {
            educationSections.push(sentence);
          }
        });
      }
    });

    // Extract experience keywords
    const experienceKeywords = ['experience', 'worked', 'developed', 'managed', 'led', 'built'];
    const experienceSections = [];
    
    experienceKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const sentences = doc.sentences().out('array');
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword)) {
            experienceSections.push(sentence);
          }
        });
      }
    });

    // Extract years of experience
    const yearsRegex = /(\d+)\+?\s*(years?|yrs?)/gi;
    const yearsMatch = text.match(yearsRegex);
    const yearsOfExperience = yearsMatch ? yearsMatch[0] : null;

    return {
      email: emails[0] || null,
      phone: phones[0] || null,
      skills: [...new Set(foundSkills)],
      education: [...new Set(educationSections)],
      experience: [...new Set(experienceSections)],
      yearsOfExperience
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {
      email: null,
      phone: null,
      skills: [],
      education: [],
      experience: [],
      yearsOfExperience: null
    };
  }
};

// Extract job requirements from job description
export const extractJobRequirements = (description) => {
  try {
    const doc = compromise(description);
    
    // Extract sentences with requirements keywords
    const requirementKeywords = ['required', 'must have', 'should have', 'need', 'experience with'];
    const requirements = [];

    requirementKeywords.forEach(keyword => {
      const sentences = doc.sentences().out('array');
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(keyword)) {
          requirements.push(sentence.trim());
        }
      });
    });

    return [...new Set(requirements)];
  } catch (error) {
    console.error('Job requirements extraction error:', error);
    return [];
  }
};
