import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const historyData = [
  {
    id: "2025-09",
    month: 9,
    year: 2025,
    monthLabel: "September 2025",
    total: 18450,
    expenses: [
      { id: "sep1", title: "Rent", amount: 8000, category: "Bills", date: "2025-09-01T10:00:00.000Z" },
      { id: "sep2", title: "Groceries", amount: 3200, category: "Food", date: "2025-09-05T10:00:00.000Z" },
      { id: "sep3", title: "Electricity Bill", amount: 1250, category: "Bills", date: "2025-09-10T10:00:00.000Z" },
      { id: "sep4", title: "Petrol", amount: 1500, category: "Transport", date: "2025-09-14T10:00:00.000Z" },
      { id: "sep5", title: "Movie Tickets", amount: 800, category: "Personal", date: "2025-09-18T10:00:00.000Z" },
      { id: "sep6", title: "Medicine", amount: 700, category: "Bills", date: "2025-09-22T10:00:00.000Z" },
      { id: "sep7", title: "Dinner Out", amount: 1200, category: "Food", date: "2025-09-25T10:00:00.000Z" },
      { id: "sep8", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2025-09-28T10:00:00.000Z" },
      { id: "sep9", title: "Miscellaneous", amount: 1201, category: "General", date: "2025-09-30T10:00:00.000Z" }
    ]
  },
  {
    id: "2025-10",
    month: 10,
    year: 2025,
    monthLabel: "October 2025",
    total: 24800,
    expenses: [
      { id: "oct1", title: "Rent", amount: 8000, category: "Bills", date: "2025-10-01T10:00:00.000Z" },
      { id: "oct2", title: "Diwali Shopping", amount: 5500, category: "Shopping", date: "2025-10-06T10:00:00.000Z" },
      { id: "oct3", title: "Groceries", amount: 3800, category: "Food", date: "2025-10-08T10:00:00.000Z" },
      { id: "oct4", title: "Sweets & Gifts", amount: 2200, category: "Personal", date: "2025-10-12T10:00:00.000Z" },
      { id: "oct5", title: "Petrol", amount: 1500, category: "Transport", date: "2025-10-15T10:00:00.000Z" },
      { id: "oct6", title: "Electricity Bill", amount: 1400, category: "Bills", date: "2025-10-18T10:00:00.000Z" },
      { id: "oct7", title: "Restaurant", amount: 1800, category: "Food", date: "2025-10-22T10:00:00.000Z" },
      { id: "oct8", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2025-10-28T10:00:00.000Z" }
    ]
  },
  {
    id: "2025-11",
    month: 11,
    year: 2025,
    monthLabel: "November 2025",
    total: 15900,
    expenses: [
      { id: "nov1", title: "Rent", amount: 8000, category: "Bills", date: "2025-11-01T10:00:00.000Z" },
      { id: "nov2", title: "Groceries", amount: 2800, category: "Food", date: "2025-11-04T10:00:00.000Z" },
      { id: "nov3", title: "Electricity Bill", amount: 1100, category: "Bills", date: "2025-11-09T10:00:00.000Z" },
      { id: "nov4", title: "Petrol", amount: 1200, category: "Transport", date: "2025-11-13T10:00:00.000Z" },
      { id: "nov5", title: "Gym Membership", amount: 1500, category: "Personal", date: "2025-11-16T10:00:00.000Z" },
      { id: "nov6", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2025-11-20T10:00:00.000Z" },
      { id: "nov7", title: "Books", amount: 701, category: "Personal", date: "2025-11-27T10:00:00.000Z" }
    ]
  },
  {
    id: "2025-12",
    month: 12,
    year: 2025,
    monthLabel: "December 2025",
    total: 31200,
    expenses: [
      { id: "dec1", title: "Rent", amount: 8000, category: "Bills", date: "2025-12-01T10:00:00.000Z" },
      { id: "dec2", title: "Christmas Shopping", amount: 6500, category: "Shopping", date: "2025-12-05T10:00:00.000Z" },
      { id: "dec3", title: "Groceries", amount: 4200, category: "Food", date: "2025-12-08T10:00:00.000Z" },
      { id: "dec4", title: "New Year Party", amount: 3500, category: "Personal", date: "2025-12-12T10:00:00.000Z" },
      { id: "dec5", title: "Petrol", amount: 1800, category: "Transport", date: "2025-12-16T10:00:00.000Z" },
      { id: "dec6", title: "Electricity Bill", amount: 1600, category: "Bills", date: "2025-12-19T10:00:00.000Z" },
      { id: "dec7", title: "Dining Out", amount: 2200, category: "Food", date: "2025-12-23T10:00:00.000Z" },
      { id: "dec8", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2025-12-27T10:00:00.000Z" },
      { id: "dec9", title: "Miscellaneous", amount: 2801, category: "General", date: "2025-12-30T10:00:00.000Z" }
    ]
  },
  {
    id: "2026-01",
    month: 1,
    year: 2026,
    monthLabel: "January 2026",
    total: 17600,
    expenses: [
      { id: "jan1", title: "Rent", amount: 8000, category: "Bills", date: "2026-01-01T10:00:00.000Z" },
      { id: "jan2", title: "Groceries", amount: 3100, category: "Food", date: "2026-01-05T10:00:00.000Z" },
      { id: "jan3", title: "Electricity Bill", amount: 1300, category: "Bills", date: "2026-01-10T10:00:00.000Z" },
      { id: "jan4", title: "Petrol", amount: 1400, category: "Transport", date: "2026-01-14T10:00:00.000Z" },
      { id: "jan5", title: "Gym Membership", amount: 1500, category: "Personal", date: "2026-01-17T10:00:00.000Z" },
      { id: "jan6", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2026-01-21T10:00:00.000Z" },
      { id: "jan7", title: "Pongal Sweets", amount: 900, category: "Food", date: "2026-01-14T10:00:00.000Z" },
      { id: "jan8", title: "Miscellaneous", amount: 801, category: "General", date: "2026-01-29T10:00:00.000Z" }
    ]
  },
  {
    id: "2026-02",
    month: 2,
    year: 2026,
    monthLabel: "February 2026",
    total: 19350,
    expenses: [
      { id: "feb1", title: "Rent", amount: 8000, category: "Bills", date: "2026-02-01T10:00:00.000Z" },
      { id: "feb2", title: "Groceries", amount: 3400, category: "Food", date: "2026-02-04T10:00:00.000Z" },
      { id: "feb3", title: "Electricity Bill", amount: 1450, category: "Bills", date: "2026-02-09T10:00:00.000Z" },
      { id: "feb4", title: "Valentine Dinner", amount: 2200, category: "Food", date: "2026-02-14T10:00:00.000Z" },
      { id: "feb5", title: "Petrol", amount: 1500, category: "Transport", date: "2026-02-16T10:00:00.000Z" },
      { id: "feb6", title: "Gym Membership", amount: 1500, category: "Personal", date: "2026-02-18T10:00:00.000Z" },
      { id: "feb7", title: "Mobile Recharge", amount: 599, category: "Bills", date: "2026-02-22T10:00:00.000Z" },
      { id: "feb8", title: "Miscellaneous", amount: 701, category: "General", date: "2026-02-26T10:00:00.000Z" }
    ]
  }
];

export const seedExpenseHistory = async (uid) => {
    if (!uid) return;
    try {
        const historyRef = collection(db, 'users', uid, 'expenseHistory');
        const existing = await getDocs(historyRef);
        console.log(`Checking history to seed for ${uid}. Found: ${existing.size}`);
        if (existing.empty) {
            console.log("Seeding initial 6-month historical tracker...");
            for (const item of historyData) {
                const { id, ...data } = item;
                await setDoc(doc(db, 'users', uid, 'expenseHistory', id), data);
            }
            console.log("Seeding complete.");
        }
    } catch (e) {
        console.error("Failed to seed expense history:", e);
    }
};
