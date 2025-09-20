class KnowledgeBaseService {
  private knowledgeBase: string = '';
  private lastFetchTime: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  async fetchFromGoogleDocs(docUrl: string): Promise<string> {
    try {
      // Check if we have cached data that's still fresh
      if (this.knowledgeBase && (Date.now() - this.lastFetchTime) < this.cacheTimeout) {
        return this.knowledgeBase;
      }

      // Extract document ID from Google Docs URL
      const docId = this.extractDocId(docUrl);
      if (!docId) {
        throw new Error('Invalid Google Docs URL');
      }

      // Convert to plain text export URL
      const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
      
      const response = await fetch(exportUrl, {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }

      const text = await response.text();
      this.knowledgeBase = this.processKnowledgeBase(text);
      this.lastFetchTime = Date.now();
      
      return this.knowledgeBase;
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      
      // Return default knowledge base if fetch fails
      return this.getDefaultKnowledgeBase();
    }
  }

  private extractDocId(url: string): string | null {
    const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  private processKnowledgeBase(text: string): string {
    // Clean up the text and format it better for AI processing
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private getDefaultKnowledgeBase(): string {
    return `
CAMPUS INFORMATION - DEFAULT KNOWLEDGE BASE

FEES AND PAYMENTS:
Q: What are the fee payment deadlines?
A: Semester fees are due by the 15th of each month. Annual fees must be paid by March 31st. Late payment incurs additional charges of 2% per month.

Q: How can I pay my fees?
A: Fees can be paid online through the college portal, by bank transfer, or at the campus accounts office during working hours (9 AM - 5 PM).

Q: What happens if I miss the fee deadline?
A: Late fees of 2% per month will be charged. After 3 months, your enrollment may be suspended.

SCHOLARSHIPS:
Q: How to apply for scholarships?
A: Scholarships can be applied through the college portal. Merit-based applications open September 1-30, need-based applications are accepted year-round.

Q: What documents are needed for scholarship application?
A: Required documents include academic transcripts, income certificate (for need-based), bank statements, and recommendation letters.

Q: When are scholarship results announced?
A: Merit-based scholarship results are announced by October 15th. Need-based scholarships are processed within 30 days of application.

ADMISSIONS:
Q: When do admissions open?
A: Admissions typically open in May for the next academic year. Check the college website for exact dates.

Q: What are the eligibility criteria?
A: Minimum 60% in qualifying examination. Specific requirements vary by course. Check the prospectus for detailed criteria.

Q: How to check admission status?
A: Login to the admission portal with your application number to check status and download documents.

ACADEMICS:
Q: When does the new semester start?
A: New semester starts on January 15th, 2024. Class schedules will be published on the college portal by January 1st.

Q: How to access the college portal?
A: Visit the college website and click on 'Student Portal'. Use your enrollment number and password to login.

Q: What is the attendance requirement?
A: Minimum 75% attendance is required in each subject to be eligible for examinations.

CAMPUS FACILITIES:
Q: What are the library hours?
A: Library is open Monday-Friday: 8 AM - 8 PM, Saturday: 9 AM - 5 PM, Sunday: Closed.

Q: How to book sports facilities?
A: Sports facilities can be booked through the sports department or online portal. Advance booking of 24 hours required.

Q: Where is the medical center?
A: Medical center is located in the main building, ground floor. Open during college hours with a qualified nurse on duty.

CONTACT INFORMATION:
- Main Office: +91-XXX-XXXX-XXX
- Admissions: +91-XXX-XXXX-XXX
- Accounts: +91-XXX-XXXX-XXX
- Library: +91-XXX-XXXX-XXX
- Email: info@college.edu
`;
  }

  getKnowledgeBase(): string {
    return this.knowledgeBase || this.getDefaultKnowledgeBase();
  }
}

export default KnowledgeBaseService;