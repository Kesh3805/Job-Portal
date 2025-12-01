# Quick Start Guide - Messaging & Interview Scheduling

## 🚀 New Features Overview

This guide will help you quickly understand and use the new messaging and interview scheduling features.

---

## 📱 Messaging System

### Access
Navigate to: **Dashboard → Messages** (`/dashboard/messages`)

### Features at a Glance
```
┌─────────────────┬────────────────────────────────────┐
│  Conversations  │        Chat Area                   │
│                 │                                    │
│  🔍 Search      │  👤 Candidate Name                │
│                 │  📧 Role                           │
│  👤 John Doe    │  ────────────────────────────────  │
│  💬 Last msg... │                                    │
│  🕐 2 min ago   │  Hi, thanks for...                │
│  [2 unread]     │                     └─ 10:30 AM   │
│                 │                                    │
│  👤 Jane Smith  │  └─ 10:32 AM Your message         │
│  💬 When can... │                                    │
│  🕐 1 hour ago  │  ────────────────────────────────  │
│                 │  Type a message...        [Send]   │
└─────────────────┴────────────────────────────────────┘
```

### How to Use

#### As a Recruiter:
1. Go to **My Jobs → View Applications**
2. Find a candidate
3. Click **"Message"** button
4. System opens conversation in Messages page
5. Start chatting!

#### As a Job Seeker:
1. Recruiters will message you
2. You'll receive a notification
3. Go to Messages page
4. Reply to the conversation

### Key Features
- ✅ Real-time messaging (when Socket.io configured)
- ✅ Unread message count
- ✅ Search conversations
- ✅ Avatar display
- ✅ Read receipts (✓ sent, ✓✓ read)
- ✅ Time formatting (Today, Yesterday, etc.)

---

## 🎯 Interview Scheduling

### Access
**Schedule**: Job Applications page → "Schedule Interview" button  
**View All**: Dashboard → Interviews (`/dashboard/interviews`)

### Scheduling Flow
```
Application Status: Pending
        ↓
   [Shortlist]
        ↓
Application Status: Shortlisted
        ↓
   [Schedule Interview] ← Button appears
        ↓
   📋 Modal Opens
        ↓
Application Status: Interview-Scheduled
        ↓
   📧 Candidate notified
        ↓
   📅 Interview added to schedule
```

### Schedule Interview Modal

```
┌─────────────────────────────────────────────────┐
│  Schedule Interview                         [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Candidate: John Doe                            │
│  Position: Senior Developer                     │
│                                                 │
│  Interview Type:                                │
│  [📞 Phone] [🎥 Video] [👤 Person] [💻 Tech] [💼 HR] │
│                                                 │
│  📅 Date: [Select Date]    🕐 Time: [Select]   │
│  ⏱️ Duration: [60 minutes ▼]                    │
│                                                 │
│  🎥 Meeting Link: https://zoom.us/j/...        │
│  📍 Location: (for in-person only)             │
│                                                 │
│  📝 Agenda:                                     │
│  ┌─────────────────────────────────────────┐   │
│  │ Technical assessment, portfolio review  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📋 Internal Notes: (private)                   │
│  ┌─────────────────────────────────────────┐   │
│  │ Review GitHub profile beforehand        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Cancel]           [Schedule Interview]        │
└─────────────────────────────────────────────────┘
```

### Interview Types

| Icon | Type | Requirements |
|------|------|-------------|
| 📞 | Phone | Optional: Meeting link |
| 🎥 | Video | **Required**: Meeting link |
| 👤 | In-Person | **Required**: Location |
| 💻 | Technical | Interview focus type |
| 💼 | HR | Interview focus type |

### Interviews Page

```
┌────────────────────────────────────────────────────────────┐
│  Interview Schedule                                         │
├────────────────────────────────────────────────────────────┤
│  🔍 Search...  [All] [Upcoming]  [Status: All ▼]          │
├────────────────────────────────────────────────────────────┤
│  ┌──────┬──────────────────────────────────────────────┐  │
│  │  15  │  🎥 Senior Full Stack Developer              │  │
│  │ DEC  │  👤 Candidate: John Doe                      │  │
│  │      │  📅 Fri, Dec 15, 2023                        │  │
│  │      │  🕐 10:00 AM (60 min)                        │  │
│  │      │  🎥 Video Interview                          │  │
│  │      │  💬 Agenda: Technical assessment...          │  │
│  │      │  [🎥 Join Meeting]                           │  │
│  │      │  Status: [Scheduled]                         │  │
│  └──────┴──────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────┬──────────────────────────────────────────────┐  │
│  │  18  │  💼 Marketing Manager - HR Round             │  │
│  │ DEC  │  👤 Candidate: Jane Smith                    │  │
│  │      │  ...                                          │  │
│  └──────┴──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 Application Workflow (For Recruiters)

### Complete Flow with New Features

```
1. Post Job
   ↓
2. Receive Applications (Status: Pending)
   ↓
3. Review Application
   Actions available:
   - 📧 Message Candidate (anytime)
   - 👁️ View Details
   - 📥 Download Resume
   - ⭐ Shortlist
   - ❌ Reject
   ↓
4. Shortlisted
   Actions available:
   - 📧 Message Candidate
   - 🎥 Schedule Interview ← NEW!
   ↓
5. Interview-Scheduled
   Actions available:
   - 📧 Message Candidate
   - ✅ Accept
   - ❌ Reject
   ↓
6. Final Decision
   - Accepted → Hire candidate
   - Rejected → End process
```

---

## 🎨 Status Badges

Visual indicators for application and interview status:

### Application Status
| Badge | Color | Meaning |
|-------|-------|---------|
| 🕐 Pending | Yellow | Awaiting review |
| 👁️ Reviewing | Blue | Under review |
| ⭐ Shortlisted | Purple | Selected for interview |
| 📅 Interview-Scheduled | Teal | Interview set |
| ✅ Accepted | Green | Hired |
| ❌ Rejected | Red | Not selected |
| 🚫 Withdrawn | Gray | Candidate withdrew |

### Interview Status
| Badge | Color | Meaning |
|-------|-------|---------|
| 📅 Scheduled | Blue | Interview confirmed |
| 🔄 Rescheduled | Yellow | Date changed |
| ✅ Completed | Green | Interview done |
| ❌ Cancelled | Red | Interview cancelled |
| 👻 No Show | Gray | Candidate didn't attend |

---

## 🔔 Notifications

Users receive notifications for:

### Recruiters
- 📨 New message from candidate
- 📅 Interview reminder (24h before)
- ✅ Candidate confirmed interview
- ❌ Candidate cancelled interview

### Job Seekers
- 📨 New message from recruiter
- 📅 Interview scheduled
- 🔄 Interview rescheduled
- ✅ Application accepted
- ❌ Application rejected

---

## 💡 Tips & Best Practices

### Messaging
✅ **DO:**
- Keep messages professional
- Respond within 24 hours
- Use messages for quick questions
- Be clear and concise

❌ **DON'T:**
- Share personal contact info (use platform)
- Use informal language
- Send spam or unsolicited messages
- Discuss salary before interview (unless asked)

### Interview Scheduling
✅ **DO:**
- Schedule at least 3 days in advance
- Provide clear meeting links (test beforehand)
- Include agenda so candidate can prepare
- Add calendar reminders
- Send confirmation message

❌ **DON'T:**
- Schedule back-to-back interviews (allow buffer time)
- Forget to test meeting links
- Schedule during odd hours
- Change time last minute (unless emergency)

### For Recruiters
📋 **Pre-Interview Checklist:**
- [ ] Resume reviewed
- [ ] Meeting link tested
- [ ] Agenda prepared
- [ ] Questions ready
- [ ] Candidate profile open
- [ ] Notes document ready

📋 **Post-Interview Checklist:**
- [ ] Add feedback (coming soon!)
- [ ] Update application status
- [ ] Send follow-up message
- [ ] Schedule next round if needed

---

## 🐛 Troubleshooting

### Messages Not Loading
**Problem**: Conversations list is empty  
**Solutions**:
1. Check if you're logged in
2. Refresh the page (F5)
3. Clear browser cache
4. Check browser console for errors

### Can't Send Message
**Problem**: Send button disabled  
**Solutions**:
1. Type a message (can't send empty)
2. Check internet connection
3. Verify you're logged in
4. Check if conversation is active

### Schedule Interview Button Not Visible
**Problem**: Button doesn't appear  
**Solutions**:
1. Ensure application status is "Shortlisted"
2. Verify you're the job owner (recruiter)
3. Refresh the page
4. Check you're on the correct job's applications page

### Interview Not Appearing in Schedule
**Problem**: Scheduled interview doesn't show  
**Solutions**:
1. Refresh /dashboard/interviews page
2. Check filter settings (All vs Upcoming)
3. Check status filter
4. Look in application details

---

## 📱 Mobile Support

Both features are fully responsive:

### Messages on Mobile
- Stacked layout (conversations → chat)
- Tap conversation to view chat
- Back button to return to list
- Touch-optimized interface

### Interviews on Mobile
- Card-based layout
- Horizontal scrolling for filters
- Collapsible interview details
- Large touch targets for buttons

---

## 🔐 Security & Privacy

### Data Protection
- ✅ Messages encrypted in transit (HTTPS)
- ✅ Only participants can view conversations
- ✅ Interview details visible to recruiter & candidate only
- ✅ Internal notes not visible to candidates
- ✅ Authorization checks on all API calls

### Best Practices
- Don't share sensitive information in messages
- Use company email for formal communication
- Keep platform messages for record-keeping
- Report inappropriate messages to admin

---

## 📞 Need Help?

### Common Questions

**Q: Can I edit a sent message?**  
A: Not yet, this feature is coming soon.

**Q: Can I attach files to messages?**  
A: Not yet, this feature is planned for future release.

**Q: Can I reschedule an interview?**  
A: Yes, use the interview update functionality (coming soon).

**Q: Will I get email notifications?**  
A: Yes, when email service is configured by admin.

**Q: Can I schedule multiple interviews for one candidate?**  
A: Yes, schedule separate interviews for different rounds.

**Q: Can candidates see my internal notes?**  
A: No, internal notes are private to recruiters.

---

## 🎯 Quick Reference

### Keyboard Shortcuts (Messages)
- `Enter` - Send message
- `Esc` - Close conversation
- `/` - Focus search

### URL Paths
- Messages: `/dashboard/messages`
- Interviews: `/dashboard/interviews`
- Schedule Interview: Via job applications page
- Job Applications: `/dashboard/jobs/:jobId/applications`

### API Endpoints
```
Messages:
GET    /api/messages/conversations
GET    /api/messages/:conversationId
POST   /api/messages
PUT    /api/messages/:conversationId/read

Interviews:
GET    /api/interviews
POST   /api/interviews
PUT    /api/interviews/:id
```

---

## ✅ Feature Checklist

Use this to verify everything works:

### Messages
- [ ] Can view conversations list
- [ ] Can search conversations
- [ ] Can select and view conversation
- [ ] Can send a message
- [ ] Can see sent messages
- [ ] Unread count displays correctly
- [ ] Avatar images show
- [ ] Time formatting is correct

### Interviews
- [ ] Can access schedule interview modal
- [ ] Can select interview type
- [ ] Can pick date and time
- [ ] Can add meeting link/location
- [ ] Can add agenda
- [ ] Can submit form
- [ ] Interview appears in schedule
- [ ] Application status updates
- [ ] Candidate receives notification

### Integration
- [ ] Message button works from applications
- [ ] Schedule button works from applications
- [ ] Navigation works correctly
- [ ] Filters work properly
- [ ] Search works properly

---

**Happy Recruiting! 🎉**

For detailed technical documentation, see: `MESSAGING_AND_INTERVIEWS.md`
