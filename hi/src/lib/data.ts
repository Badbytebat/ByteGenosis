
import type { PortfolioData } from './types';
import { DEFAULT_AI_CHAT_INSTRUCTIONS } from './ai-defaults';

export const defaultData: PortfolioData = {
  header: {
    logoText: "RM",
  },
  hero: {
    title: "Ritesh Manandhar",
    subtitle: "Aspiring Data Scientist | Analytical Problem Solver | Technology Enthusiast",
  },
  about: {
    imageUrl: "https://placehold.co/400x500.png",
    title: "Driven by Data, Defined by Results",
    description1: "I am a dedicated and aspiring Data Scientist with a proven ability to extract and interpret complex datasets. My passion lies in transforming raw data into actionable insights that drive strategic business decisions and fuel innovation.",
    description2: "My approach is defined by a persistent and analytical mindset, thriving on complex challenges that demand resourcefulness. I am committed to leveraging data to solve critical problems and deliver measurable impact.",
    description3: "Beyond my core work, I am continually expanding my technical repertoire by exploring emerging technologies and contributing to the open-source community. I believe in continuous learning as a cornerstone of professional growth.",
  },
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
      tags: ["Next.js", "React", "Tailwind CSS", "Supabase"],
      link: "#"
    }
  ],
  qualifications: [
    {
      id: 1,
      type: 'education',
      title: "12th, Business/Commerce, General",
      institution: "National Institute of Open Schooling (NIOS)",
      duration: "Mar 2023 - Nov 2023",
      description: "Achieved a grade of 75%."
    },
    {
      id: 2,
      type: 'certification',
      title: "AWS - Solutions Architecture Job Simulation",
      institution: "Forage",
      duration: "Issued Jun 2025",
      description: "Skills: AWS Elastic Beanstalk, Amazon RDS, Cloud Computing, Amazon S3, Amazon EC2, Amazon Web Services (AWS)",
      link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/pmnMSL4QiQ9JCgE3W/kkE9HyeNcw6rwCRGw_pmnMSL4QiQ9JCgE3W_myWswfhj978rcKCfJ_1751308317962_completion_certificate.pdf"
    },
    {
      id: 3,
      type: 'certification',
      title: "Discover data analysis",
      institution: "Microsoft Learning",
      duration: "Issued Jun 2025",
      description: "Skills: Data Analysis, Microsoft Power BI, Microsoft Power Platform",
      link: "https://learn.microsoft.com/api/achievements/share/en-us/Thebadbat-3030/FMSCAGPX?sharingId=B002C207BF8AF792"
    },
    {
      id: 4,
      type: 'certification',
      title: "Get started with data analytics",
      institution: "Microsoft Learning",
      duration: "Issued Jun 2025",
      description: "Skills: Data Analysis, Data Visualization, Data Analysis Process",
      link: "https://learn.microsoft.com/api/achievements/share/en-us/Thebadbat-3030/XQ5VQMZY?sharingId=B002C207BF8AF792"
    },
    {
      id: 5,
      type: 'certification',
      title: "Google Data Analytics Professional Certificate",
      institution: "Google Career Certificates",
      duration: "Issued Apr 2025",
      description: "Credential ID: 4FWDFE5Y5DKY. Skills: R (Programming Language), Data Analysis, Data Processing, Data Management, Data Visualization, SQL",
      link: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/4FWDFE5Y5DKY"
    },
    {
      id: 6,
      type: 'certification',
      title: "Introduction to end-to-end analytics using Microsoft Fabric",
      institution: "Microsoft Learning",
      duration: "Issued Apr 2025",
      description: "Skills: Business Analysis, Data Analysis, Data Engineering, Data Science, Microsoft Fabric",
      link: "https://learn.microsoft.com/api/achievements/share/en-us/Thebadbat-3030/A4QR26Q7?sharingId=B002C207BF8AF792"
    },
    {
      id: 7,
      type: 'certification',
      title: "Prompt Design in Vertex AI Skill Badge",
      institution: "Google",
      duration: "Issued Apr 2025",
      description: "",
      link: "https://www.credly.com/badges/bd3319d6-379a-4611-8615-f97360dcdcb5/linked_in_profile"
    },
     {
      id: 8,
      type: 'certification',
      title: "Train and track machine learning models with MLflow in Microsoft Fabric",
      institution: "Microsoft Learning",
      duration: "Issued Apr 2025",
      description: "",
      link: "https://learn.microsoft.com/en-us/training/modules/train-track-model-fabric/7-summary#completion"
    },
    {
      id: 9,
      type: 'certification',
      title: "Data Fundamentals",
      institution: "IBM SkillsBuild",
      duration: "Issued Nov 2024",
      description: "Skills: Clean Data, Data Analysis, Data Analysis Process, Data Science, Refine Data, Data Visualization, Data Tools, Data Science Methodology",
      link: "https://www.credly.com/badges/70218c25-53e3-4fea-94f9-44f97a3f2ab6"
    },
    {
      id: 10,
      type: 'certification',
      title: "LIDAR Data Processing and Applications",
      institution: "Indian Institute of Remote Sensing (IIRS), Indian Space Research Organization (ISRO)",
      duration: "Issued Aug 2023",
      description: "Skills: Data Processing, Large-scale Data Processing",
      link: "https://isrolms.iirs.gov.in/mod/customcert/view.php?id=4520&downloadown=1"
    },
    {
      id: 11,
      type: 'certification',
      title: "Get started with data science in Microsoft Fabric",
      institution: "Microsoft Learning",
      duration: "Issued 2025",
      description: "Skills: Microsoft Fabric, Data Analysis",
      link: "https://learn.microsoft.com/api/achievements/share/en-us/Thebadbat-3030/FMZWPWRX?sharingId=B002C207BF8AF792"
    }
  ],
  contact: [
    {
        id: 1,
        icon: "Mail",
        label: "Email",
        value: "riteshmdhr@gmail.com",
        href: "mailto:riteshmdhr@gmail.com"
    },
    {
        id: 2,
        icon: "Linkedin",
        label: "LinkedIn",
        value: "linkedin.com/in/ritesh-bytegenosis",
        href: "https://www.linkedin.com/in/ritesh-bytegenosis"
    },
    {
        id: 3,
        icon: "Github",
        label: "GitHub",
        value: "github.com/thebadbat",
        href: "https://github.com/thebadbat"
    },
    {
        id: 4,
        icon: "Instagram",
        label: "Instagram",
        value: "instagram.com/thebadbat.ig",
        href: "https://instagram.com/thebadbat.ig"
    },
    {
        id: 5,
        icon: "Whatsapp",
        label: "WhatsApp",
        value: "+91 8094195155",
        href: "https://wa.me/918094195155"
    },
    {
        id: 6,
        icon: "Kaggle",
        label: "Kaggle",
        value: "kaggle.com/thebadbat",
        href: "https://www.kaggle.com/thebadbat"
    },
    {
        id: 7,
        icon: "HackerRank",
        label: "HackerRank",
        value: "hackerrank.com/profile/riteshmdhr",
        href: "https://www.hackerrank.com/profile/riteshmdhr"
    },
    {
        id: 8,
        icon: "GeeksforGeeks",
        label: "GeeksforGeeks",
        value: "geeksforgeeks.org/user/riteshmdhr",
        href: "https://auth.geeksforgeeks.org/user/riteshmdhr/practice"
    }
  ],
  resumeUrl: "/resume.pdf",
  aiAssistant: {
    instructions: DEFAULT_AI_CHAT_INSTRUCTIONS,
    extraDetails: "",
  },
  siteMeta: {
    title: "Ritesh's Portfolio",
    description:
      "Personal portfolio — data science, analytics, and projects.",
    ogImageUrl: undefined,
    twitterSite: undefined,
  },
  notes: [],
  downloadableAssets: [],
  backgroundMusicTracks: [],
  themePalette: "default",
};
