import type { PortfolioData } from './types';

export const defaultData: PortfolioData = {
  experience: [
    {
      id: 1,
      role: "Process Associate",
      company: "AndWeSupport",
      duration: "May 2025 - Present",
      description: "Key Skills: Sage CRM, ESP, AIM, Research Skills, Time Management, High Level Of Accuracy, Attention to Detail."
    },
    {
      id: 2,
      role: "Assistant",
      company: "Flipkart",
      duration: "Dec 2023 - Jun 2025",
      description: "Managed inbound and outbound shipments, reduced untraceable shipments by 30%, led initiatives to minimize damage, identified fraudulent shipments, and maintained operational data in Google Sheets."
    },
    {
      id: 3,
      role: "Field Executive",
      company: "Flipkart",
      duration: "Oct 2023 - Dec 2023",
      description: "Demonstrated skills in problem solving, teamwork, and customer service."
    }
  ],
  skills: [
    { id: 1, name: "Data Analysis", level: 95 },
    { id: 2, name: "Python (Programming Language)", level: 90 },
    { id: 3, name: "SQL", level: 90 },
    { id: 4, name: "Data Visualization", level: 90 },
    { id: 5, name: "Microsoft Power BI", level: 85 },
    { id: 6, name: "Data Science", level: 85 },
    { id: 7, name: "Amazon Web Services (AWS)", level: 80 },
    { id: 8, name: "Cloud Computing", level: 80 },
    { id: 9, name: "R (Programming Language)", level: 75 },
    { id: 10, name: "Matplotlib & Seaborn", level: 75 },
    { id: 11, name: "Communication", level: 95 },
    { id: 12, name: "Problem Solving", level: 95 },
    { id: 13, name: "Teamwork", level: 90 },
    { id: 14, name: "Microsoft Excel", level: 85 }
  ],
  projects: [
    {
      id: 1,
      title: "Logistics Analysis at Flipkart",
      description: "Analyzed shipment data using Google Sheets to identify inefficiencies. My work contributed to a 30% reduction in untraceable shipments and highlighted methods to minimize damage.",
      tags: ["Data Analysis", "Google Sheets", "Logistics"],
      link: "#"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "This very website, built with Next.js and Tailwind CSS, showcasing my skills and experience. All data is managed via Firestore.",
      tags: ["Next.js", "React", "Tailwind CSS", "Firebase"],
      link: "#"
    }
  ],
  qualifications: [
    {
      id: 1,
      title: "12th, Business/Commerce, General",
      institution: "National Institute of Open Schooling (NIOS)",
      duration: "Mar 2023 - Nov 2023",
      description: "Achieved a grade of 75%."
    },
    {
      id: 2,
      title: "Google Data Analytics Professional Certificate",
      institution: "Google Career Certificates",
      duration: "Issued Apr 2025",
      description: "Credential ID: 4FWDFE5Y5DKY. Gained skills in R, SQL, and the full data analysis lifecycle."
    },
     {
      id: 3,
      title: "Data Fundamentals",
      institution: "IBM SkillsBuild",
      duration: "Issued Nov 2024",
      description: "Covered the core concepts of the data science methodology, including data analysis, visualization, and tools."
    },
    {
      id: 4,
      title: "AWS - Solutions Architecture Job Simulation",
      institution: "Forage",
      duration: "Issued Jun 2025",
      description: "Credential ID: XPGwonksTtrxCvs67. Applied skills in core AWS services like EC2, S3, and RDS."
    },
    {
      id: 5,
      title: "Microsoft Certified: Power Platform & Fabric",
      institution: "Microsoft Learning",
      duration: "Issued 2025",
      description: "Completed multiple learning paths including 'Discover data analysis', 'Introduction to end-to-end analytics using Microsoft Fabric', and 'Get started with data science in Microsoft Fabric'."
    },
    {
      id: 6,
      title: "LIDAR Data Processing and Applications",
      institution: "IIRS, ISRO",
      duration: "Issued Aug 2023",
      description: "Specialized training in large-scale data processing for remote sensing applications."
    },
    {
      id: 7,
      title: "Prompt Design in Vertex AI Skill Badge",
      institution: "Google",
      duration: "Issued Apr 2025",
      description: "Demonstrated proficiency in designing and implementing prompts for Generative AI models."
    }
  ]
};
