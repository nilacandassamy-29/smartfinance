import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

export const generateFinancialReport = async (metrics, userProfile) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; background: white; }
          .header { background: #6366f1; padding: 30px; border-radius: 20px; color: white; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 900; }
          .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; font-weight: 500; }
          
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #f8fafc; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0; }
          .card-label { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .card-value { font-size: 18px; font-weight: 900; color: #0f172a; }
          
          .health-section { background: #f1f5f9; padding: 25px; border-radius: 20px; margin-bottom: 30px; }
          .health-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .health-title { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
          .health-score { font-size: 32px; font-weight: 900; color: #6366f1; }
          
          .insight { padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 4px solid #6366f1; background: white; border: 1px solid #e2e8f0; border-left-width: 4px; }
          .insight-cat { font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
          .insight-text { font-size: 12px; font-weight: 500; line-height: 1.5; }
          
          .footer { text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .footer p { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SmartFinance Intelligence</h1>
          <p>Prepared for ${userProfile?.name || 'Valued User'} • ${dateStr}</p>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-label">Net Portfolio Balance</div>
            <div class="card-value">Rs. ${metrics.balance.toLocaleString()}</div>
          </div>
          <div class="card">
            <div class="card-label">Monthly Savings Rate</div>
            <div class="card-value">${metrics.savingsRate.toFixed(1)}%</div>
          </div>
          <div class="card">
            <div class="card-label">Monthly Inflow</div>
            <div class="card-value">Rs. ${metrics.income.toLocaleString()}</div>
          </div>
          <div class="card">
            <div class="card-label">Total Outflow</div>
            <div class="card-value">Rs. ${metrics.expenses.toLocaleString()}</div>
          </div>
        </div>

        <div class="health-section">
          <div class="health-header">
            <span class="health-title">Strategic Health Score</span>
            <span class="health-score">${metrics.healthScore}/100</span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin: 0;">Your financial health status is currently categorized as <strong>${metrics.healthScore >= 70 ? 'Excellent' : metrics.healthScore >= 40 ? 'Stable' : 'Risk Management Required'}</strong>.</p>
        </div>

        <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">AI Financial Coaching Insights</h2>
        ${metrics.insights.map(insight => `
          <div class="insight" style="border-left-color: ${getInsightHex(insight.type)}">
            <div class="insight-cat">${insight.category}</div>
            <div class="insight-text">${insight.text}</div>
          </div>
        `).join('')}

        <div class="footer">
          <p>SmartFinance Mobile Protocol • Encrypted Intelligence Report</p>
        </div>
      </body>
    </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, { 
            mimeType: 'application/pdf', 
            dialogTitle: 'SmartFinance Intelligence Report',
            UTI: 'com.adobe.pdf' 
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    }
};

const getInsightHex = (type) => {
    switch (type) {
        case 'positive': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'alert': return '#ef4444';
        case 'critical': return '#ef4444';
        case 'info': return '#6366f1';
        default: return '#6366f1';
    }
};
