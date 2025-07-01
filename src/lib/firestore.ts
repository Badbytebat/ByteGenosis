
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { PortfolioData } from './types';
import { defaultData } from './data';

const PORTFOLIO_DOC_ID = 'main-portfolio';
const PORTFOLIO_COLLECTION = 'portfolios';

export const getPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Basic validation to merge default data structure with fetched data
      const fetchedData = docSnap.data();
      return {
        header: fetchedData.header || defaultData.header,
        experience: fetchedData.experience || defaultData.experience,
        skills: fetchedData.skills || defaultData.skills,
        projects: fetchedData.projects || defaultData.projects,
        qualifications: fetchedData.qualifications || defaultData.qualifications,
        contact: fetchedData.contact || defaultData.contact,
        resumeUrl: fetchedData.resumeUrl || defaultData.resumeUrl,
      };
    } else {
      // If the document doesn't exist, just return the default data.
      // Don't try to create it here, as this function can be called by unauthenticated users.
      // The document will be created on the first save by an authenticated user.
      console.log('No portfolio document found, returning default data.');
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // Return default data as a fallback in case of error
    return defaultData;
  }
};

export const savePortfolioData = async (data: PortfolioData): Promise<void> => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOC_ID);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    throw new Error('Failed to save data to Firestore.');
  }
};
