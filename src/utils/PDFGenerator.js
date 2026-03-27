import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateFinancialReport = async (userProfile, metrics, expenses) => {
 const html = `
 <!DOCTYPE html>
 <html lang="en">
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Financial Intelligence Report</title>
 <style>
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
 
 body {
 font-family: 'Inter', sans-serif;
 background-color: #020617;
 color: #f8fafc;
 margin: 0;
 padding: 40px;
 }

 .header {
 display: flex;
 justify-content: space-between;
 align-items: flex-end;
 margin-bottom: 60px;
 border-bottom: 1px solid rgba(255, 255, 255, 0.1);
 padding-bottom: 20px;
 }

 .header h1 {
 font-size: 48px;
 font-weight: 900;
 margin: 0;
 letter-spacing: -2px;
 text-transform: uppercase;
 font-style: ;
 }

 .header p {
 font-size: 10px;
 font-weight: 900;
 color: #64748b;
 text-transform: uppercase;
 letter-spacing: 4px;
 margin: 5px 0 0 0;
 }

 .hero-card {
 background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
 border-radius: 40px;
 padding: 40px;
 margin-bottom: 40px;
 box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);
 }

 .hero-card p {
 font-size: 10px;
 font-weight: 900;
 color: rgba(255, 255, 255, 0.7);
 text-transform: uppercase;
 letter-spacing: 3px;
 margin: 0 0 10px 0;
 }

 .hero-card h2 {
 font-size: 56px;
 font-weight: 900;
 margin: 0;
 letter-spacing: -1px;
 font-style: ;
 }

 .stats-grid {
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 20px;
 margin-bottom: 60px;
 }

 .stat-card {
 background: rgba(255, 255, 255, 0.05);
 border: 1px solid rgba(255, 255, 255, 0.1);
 border-radius: 30px;
 padding: 30px;
 }

 .stat-card p {
 font-size: 9px;
 font-weight: 900;
 color: #64748b;
 text-transform: uppercase;
 letter-spacing: 2px;
 margin: 0 0 10px 0;
 }

 .stat-card h3 {
 font-size: 24px;
 font-weight: 900;
 margin: 0;
 letter-spacing: -0.5px;
 }

 .section-title {
 display: flex;
 align-items: center;
 gap: 15px;
 margin-bottom: 30px;
 }

 .section-title div {
 width: 6px;
 height: 24px;
 background: #4f46e5;
 border-radius: 3px;
 }

 .section-title h2 {
 font-size: 20px;
 font-weight: 900;
 margin: 0;
 text-transform: uppercase;
 letter-spacing: 1px;
 font-style: ;
 }

 .insights-container {
 margin-bottom: 60px;
 }

 .insight {
 background: rgba(255, 255, 255, 0.03);
 border: 1px solid rgba(255, 255, 255, 0.05);
 border-radius: 25px;
 padding: 25px;
 margin-bottom: 15px;
 }

 .insight p {
 font-size: 14px;
 line-height: 1.6;
 margin: 0;
 color: #cbd5e1;
 }

 .transaction-table {
 width: 100%;
 border-collapse: collapse;
 }

 .transaction-table th {
 text-align: left;
 font-size: 10px;
 font-weight: 900;
 color: #64748b;
 text-transform: uppercase;
 letter-spacing: 2px;
 padding: 15px 20px;
 border-bottom: 1px solid rgba(255, 255, 255, 0.1);
 }

 .transaction-table td {
 padding: 20px;
 font-size: 13px;
 border-bottom: 1px solid rgba(255, 255, 255, 0.05);
 }

 .transaction-table tr:last-child td {
 border-bottom: none;
 }

 .amount-positive { color: #10b981; font-weight: 900; }
 .amount-negative { color: #f43f5e; font-weight: 900; }

 .footer {
 margin-top: 80px;
 text-align: center;
 font-size: 9px;
 font-weight: 900;
 color: #334155;
 text-transform: uppercase;
 letter-spacing: 5px;
 }
 </style>
 </head>
 <body>
 <div class="header">
 <div>
 <p>Main Console Overview</p>
 <h1>Financial Report</h1>
 </div>
 <div>
 <p>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
 </div>
 </div>

 <div class="hero-card">
 <p>Net Portfolio Balance</p>
 <h2>₹${metrics.balance.toLocaleString('en-IN')}</h2>
 </div>

 <div class="stats-grid">
 <div class="stat-card">
 <p>Total Revenue</p>
 <h3>₹${metrics.income.toLocaleString('en-IN')}</h3>
 </div>
 <div class="stat-card">
 <p>Total Outflow</p>
 <h3>₹${metrics.totalExpenses.toLocaleString('en-IN')}</h3>
 </div>
 <div class="stat-card">
 <p>Health Efficiency</p>
 <h3>${metrics.healthScore}%</h3>
 </div>
 <div class="stat-card">
 <p>Savings Resonance</p>
 <h3>${metrics.savingsRate.toFixed(1)}%</h3>
 </div>
 </div>

 <div class="insights-container">
 <div class="section-title">
 <div></div>
 <h2>AI Intelligence Stream</h2>
 </div>
 ${metrics.insights.map(i => `
 <div class="insight">
 <p>${i.text}</p>
 </div>
 `).join('')}
 </div>

 <div class="transactions-container">
 <div class="section-title">
 <div></div>
 <h2>Transaction Protocols</h2>
 </div>
 <table class="transaction-table">
 <thead>
 <tr>
 <th>Protocol</th>
 <th>Sector</th>
 <th>Date</th>
 <th>Value</th>
 </tr>
 </thead>
 <tbody>
 ${expenses.map(e => `
 <tr>
 <td><strong>${e.description}</strong></td>
 <td style="color: #818cf8;">${e.category}</td>
 <td>${e.date}</td>
 <td class="${e.type === 'income' ? 'amount-positive' : 'amount-negative'}">
 ${e.type === 'income' ? '+' : '-'}₹${Number(e.amount).toLocaleString('en-IN')}
 </td>
 </tr>
 `).join('')}
 </tbody>
 </table>
 </div>

 <div class="footer">
 Generated by SmartFinance Mobile Matrix
 </div>
 </body>
 </html>
 `;

 try {
 const { uri } = await Print.printToFileAsync({ html });
 await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
 } catch (error) {
 console.error('PDF Generation Error:', error);
 throw error;
 }
};
