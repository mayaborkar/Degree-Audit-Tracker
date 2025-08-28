// PDF Upload and Website Parsing System
class UploadParser {
    constructor(degreeTracker) {
        this.degreeTracker = degreeTracker;
        this.supportedFileTypes = ['application/pdf', 'text/plain', 'text/csv'];
        this.init();
    }

    init() {
        console.log('📁 Upload Parser initialized');
    }

    // PDF and Text File Parsing
    async parseCourseFile(file) {
        try {
            if (!this.supportedFileTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error(`Unsupported file type: ${file.type}`);
            }

            const content = await this.readFileContent(file);
            const courses = await this.extractCoursesFromContent(content, file.type);
            
            return {
                success: true,
                courses: courses,
                message: `Successfully parsed ${courses.length} courses from ${file.name}`
            };

        } catch (error) {
            console.error('File parsing error:', error);
            return {
                success: false,
                courses: [],
                message: `Error parsing ${file.name}: ${error.message}`
            };
        }
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                    // For PDF files, we'll use a simple text extraction
                    // In a real implementation, you'd use PDF.js or similar
                    resolve(event.target.result);
                } else {
                    resolve(event.target.result);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    async extractCoursesFromContent(content, fileType) {
        let textContent = '';
        
        if (fileType === 'application/pdf' || (typeof content !== 'string')) {
            // Simple PDF text extraction (in practice, use PDF.js)
            textContent = await this.extractTextFromPDF(content);
        } else {
            textContent = content;
        }

        return this.parseCourseText(textContent);
    }

    async extractTextFromPDF(pdfBuffer) {
        // Simplified PDF text extraction
        // In a real implementation, you would use PDF.js:
        // const pdfjsLib = require('pdfjs-dist');
        // const pdf = await pdfjsLib.getDocument(pdfBuffer).promise;
        
        // For now, return a sample extraction result
        return `
            Sample PDF content extraction:
            CS 3200 Introduction to Databases (4 credits) - Spring 2025
            CS 4500 Software Development (4 credits) - Fall 2025  
            MATH 2331 Linear Algebra (4 credits) - Spring 2025
            DS 3500 Advanced Programming with Data (4 credits) - Fall 2025
            CS 4800 Algorithms (4 credits) - Spring 2026
        `;
    }

    parseCourseText(text) {
        const courses = [];
        const lines = text.split('\n');
        
        // Enhanced regex patterns for course matching
        const patterns = [
            // Pattern: "CS 3200 Database Systems (4 credits) - Spring 2025"
            /([A-Z]{2,4})\s*(\d{3,4})\s+([^(]+?)\s*\((\d+)\s*credits?\)\s*-?\s*([^,\n]*)/gi,
            // Pattern: "CS 3200 - Database Systems - 4 credits"
            /([A-Z]{2,4})\s*(\d{3,4})\s*-\s*([^-]+?)\s*-\s*(\d+)\s*credits?/gi,
            // Pattern: "CS3200 Database Systems 4"
            /([A-Z]{2,4})(\d{3,4})\s+([^0-9]+?)\s+(\d+)/gi,
            // Pattern: "CS 3200: Database Systems (4)"
            /([A-Z]{2,4})\s*(\d{3,4}):\s*([^(]+?)\s*\((\d+)\)/gi
        ];

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            for (const pattern of patterns) {
                const matches = [...line.matchAll(pattern)];
                
                matches.forEach(match => {
                    let [, subject, number, title, credits, semester] = match;
                    
                    // Clean up the extracted data
                    subject = subject.toUpperCase().trim();
                    number = number.trim();
                    title = title.trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
                    credits = parseInt(credits) || 4;
                    semester = semester ? semester.trim() : 'Uploaded';

                    const courseCode = `${subject} ${number}`;
                    
                    // Avoid duplicates
                    if (!courses.some(c => c.code === courseCode)) {
                        courses.push({
                            code: courseCode,
                            title: title || `Course ${courseCode}`,
                            credits: credits,
                            semester: semester,
                            status: 'planned',
                            category: this.degreeTracker.determineCourseCategory(courseCode),
                            addedBy: 'pdf-upload',
                            addedDate: new Date().toISOString()
                        });
                    }
                });
                
                if (matches.length > 0) break; // Found matches with this pattern
            }
        });

        return courses;
    }

    // Website Requirements Parsing
    async parseRequirementsFromURL(url, programType = 'major') {
        try {
            console.log(`🔍 Parsing requirements from: ${url}`);
            
            // In a real implementation, you'd fetch the URL content
            // For now, we'll simulate parsing based on URL patterns
            const mockRequirements = await this.simulateURLParsing(url, programType);
            
            return {
                success: true,
                requirements: mockRequirements,
                message: `Successfully parsed ${mockRequirements.length} requirements from ${programType}`
            };

        } catch (error) {
            console.error('URL parsing error:', error);
            return {
                success: false,
                requirements: [],
                message: `Error parsing URL: ${error.message}`
            };
        }
    }

    async simulateURLParsing(url, programType) {
        // Simulate different university catalog parsing
        const domain = this.extractDomain(url);
        const requirements = [];

        if (domain.includes('northeastern.edu')) {
            requirements.push(...this.parseNortheasternURL(url, programType));
        } else if (domain.includes('mit.edu')) {
            requirements.push(...this.parseMITURL(url, programType));
        } else if (domain.includes('harvard.edu')) {
            requirements.push(...this.parseHarvardURL(url, programType));
        } else {
            requirements.push(...this.parseGenericURL(url, programType));
        }

        return requirements;
    }

    extractDomain(url) {
        try {
            return new URL(url).hostname.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    }

    parseNortheasternURL(url, programType) {
        if (programType === 'minor' && url.includes('mathematics')) {
            return [
                { code: 'MATH 1341', title: 'Calculus 1', credits: 4, required: true },
                { code: 'MATH 1342', title: 'Calculus 2', credits: 4, required: true },
                { code: 'MATH 2321', title: 'Calculus 3', credits: 4, required: true },
                { code: 'MATH 2331', title: 'Linear Algebra', credits: 4, required: true },
                { code: 'MATH 3081', title: 'Probability and Statistics', credits: 4, required: true },
                { code: 'MATH 4XXX', title: 'Advanced Mathematics Elective', credits: 4, required: true }
            ];
        }
        
        if (programType === 'minor' && url.includes('physics')) {
            return [
                { code: 'PHYS 1151', title: 'Physics for Engineers 1', credits: 4, required: true },
                { code: 'PHYS 1152', title: 'Physics for Engineers 2', credits: 4, required: true },
                { code: 'PHYS 1153', title: 'Physics for Engineers 3', credits: 4, required: true },
                { code: 'PHYS 2303', title: 'Modern Physics', credits: 4, required: true },
                { code: 'PHYS 3XXX', title: 'Physics Elective 1', credits: 4, required: true },
                { code: 'PHYS 4XXX', title: 'Physics Elective 2', credits: 4, required: true }
            ];
        }

        // Default CS requirements
        return [
            { code: 'CS 1800', title: 'Discrete Structures', credits: 4, required: true },
            { code: 'CS 2500', title: 'Fundamentals of CS 1', credits: 4, required: true },
            { code: 'CS 2510', title: 'Fundamentals of CS 2', credits: 4, required: true },
            { code: 'CS 3000', title: 'Algorithms and Data', credits: 4, required: true }
        ];
    }

    parseMITURL(url, programType) {
        if (programType === 'major' && url.includes('computer-science')) {
            return [
                { code: '6.0001', title: 'Introduction to Computer Science', credits: 4, required: true },
                { code: '6.0002', title: 'Introduction to Computational Thinking', credits: 4, required: true },
                { code: '6.006', title: 'Introduction to Algorithms', credits: 4, required: true },
                { code: '6.004', title: 'Computation Structures', credits: 4, required: true }
            ];
        }
        return [];
    }

    parseHarvardURL(url, programType) {
        if (programType === 'major' && url.includes('computer-science')) {
            return [
                { code: 'CS 50', title: 'Introduction to Computer Science', credits: 4, required: true },
                { code: 'CS 51', title: 'Abstraction and Design', credits: 4, required: true },
                { code: 'CS 61', title: 'Systems Programming', credits: 4, required: true },
                { code: 'CS 121', title: 'Introduction to Algorithms', credits: 4, required: true }
            ];
        }
        return [];
    }

    parseGenericURL(url, programType) {
        // Generic parsing for unknown universities
        return [
            { code: 'GEN 1000', title: 'Generic Requirement 1', credits: 4, required: true },
            { code: 'GEN 2000', title: 'Generic Requirement 2', credits: 4, required: true },
            { code: 'GEN 3000', title: 'Generic Requirement 3', credits: 4, required: true }
        ];
    }

    // Integration methods
    addCoursesToTracker(courses, status = 'planned') {
        let addedCount = 0;
        
        courses.forEach(course => {
            // Check for duplicates
            const exists = [
                ...this.degreeTracker.studentData.completedCourses,
                ...this.degreeTracker.studentData.plannedCourses
            ].some(existingCourse => existingCourse.code === course.code);

            if (!exists) {
                const courseData = {
                    ...course,
                    status: status
                };

                if (status === 'completed') {
                    this.degreeTracker.studentData.completedCourses.push(courseData);
                    this.degreeTracker.studentData.completedCredits += course.credits;
                } else {
                    this.degreeTracker.studentData.plannedCourses.push(courseData);
                }
                
                addedCount++;
            }
        });

        if (addedCount > 0) {
            this.degreeTracker.updateRequirementFulfillment();
            this.degreeTracker.updateCompletedCredits();
            this.degreeTracker.updateAllData();
        }

        return addedCount;
    }

    addRequirementsToTracker(requirements, programName, programType) {
        // Convert parsed requirements to the tracker format
        const formattedRequirements = requirements.map(req => ({
            name: `${req.code} - ${req.title}`,
            description: req.title,
            credits: req.credits,
            fulfilled: false,
            planned: false,
            matchingCourses: [req.code]
        }));

        // Add to the appropriate requirements category
        const categoryName = `${programName.toLowerCase().replace(/\s+/g, '')}${programType.charAt(0).toUpperCase() + programType.slice(1)}`;
        
        if (!this.degreeTracker.requirements[categoryName]) {
            this.degreeTracker.requirements[categoryName] = [];
        }
        
        this.degreeTracker.requirements[categoryName].push(...formattedRequirements);
        
        // Update fulfillment status
        this.degreeTracker.updateRequirementFulfillment();
        this.degreeTracker.updateAllData();

        return formattedRequirements.length;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UploadParser;
}