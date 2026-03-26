export const calculateHealthScore = (income, expenses, savings) => {
    let score = 0;

    // 1. Savings Rate (50 points)
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    if (savingsRate >= 30) score += 50;
    else if (savingsRate >= 20) score += 40;
    else if (savingsRate >= 10) score += 30;
    else if (savingsRate > 0) score += 10;

    // 2. Expense Control (30 points)
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 100;

    if (expenseRatio <= 50) score += 30;
    else if (expenseRatio <= 70) score += 20;
    else if (expenseRatio <= 90) score += 10;

    // 3. Absolute Surplus Stability (20 points)
    if (savings >= 5000) score += 20;
    else if (savings >= 1000) score += 10;

    return Math.min(score, 100);
};

export const getHealthStatus = (score) => {
    if (score >= 70) return { label: 'Stable', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'emerald' };
    if (score >= 40) return { label: 'Needs Optimization', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'amber' };
    return { label: 'Risk Zone', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', iconColor: 'rose' };
};

export const calculateEmergencyGap = (monthlyExpenses, currentSavings = 0) => {
    const required = monthlyExpenses * 6;
    const gap = Math.max(0, required - currentSavings);
    const progress = Math.min(100, (currentSavings / required) * 100) || 0;

    return {
        required,
        current: currentSavings,
        gap,
        progress
    };
};

export const generateSmartInsights = (income, expenses, savings, healthScore, gap) => {
    const insights = [];

    if (healthScore < 40) {
        insights.push({
            type: 'warning',
            text: 'Your financial health is in the Risk Zone. Consider reducing discretionary expenses immediately.',
            category: 'Health Score'
        });
    } else if (healthScore >= 80) {
        insights.push({
            type: 'positive',
            text: 'Excellent financial health! You are ready to start high-growth investments.',
            category: 'Health Score'
        });
    } else if (healthScore >= 40) {
        insights.push({
            type: 'info',
            text: 'Your financial health is fair. Focus on increasing your savings rate to improve your score.',
            category: 'Health Score'
        });
    }

    if (savings < 0) {
        insights.push({
            type: 'alert',
            text: `Expenses exceed income. You have a deficit of ₹${Math.abs(savings).toLocaleString()}. Review your spending categories.`,
            category: 'Savings'
        });
    } else if (savings > 0) {
        insights.push({
            type: 'positive',
            text: `You have ₹${savings.toLocaleString()} available for investment. Consider allocating this to an SIP.`,
            category: 'Savings'
        });
    }

    const expenseRatio = income > 0 ? (expenses / income) : 0;
    if (expenseRatio > 0.7) {
        insights.push({
            type: 'info',
            text: 'Expenses take up >70% of income. Try to follow the 50-30-20 rule for better financial balance.',
            category: 'Expenses'
        });
    }

    if (gap > 0) {
        insights.push({
            type: 'critical',
            text: `Emergency Fund Gap Detected: Shortfall of ₹${gap.toLocaleString()} to reach 6-month safety buffer.`,
            category: 'Emergency Fund'
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'info',
            text: 'Start adding your income and expenses to receive personalized financial coaching insights.',
            category: 'Getting Started'
        });
    }

    return insights;
};

export const calculateFinancialMetrics = (expenses, income) => {
    const profileIncome = Number(income) || 0;
    const totalExpenses = expenses
        .filter(e => !e.type || e.type === 'expense')
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const loggedIncome = expenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalIncome = profileIncome + loggedIncome;
    const savings = totalIncome - totalExpenses;
    const healthScore = calculateHealthScore(totalIncome, totalExpenses, savings);
    const { gap, progress } = calculateEmergencyGap(totalExpenses > 0 ? totalExpenses : profileIncome * 0.7, Math.max(savings, 0));
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return {
        healthScore,
        income: totalIncome,
        expenses: totalExpenses,
        totalExpenses,
        savings,
        balance: savings,
        savingsRate,
        insights: generateSmartInsights(totalIncome, totalExpenses, savings, healthScore, gap),
        emergencyGap: gap,
        emergencyCoverage: progress
    };
};

export const prepareChartData = (expenses, timePeriod = 'monthly') => {
    const expenseItems = expenses.filter(e => e.type === 'expense');

    if (timePeriod === 'quarterly') {
        const quarterTotals = { 'Q1 (Jan-Mar)': 0, 'Q2 (Apr-Jun)': 0, 'Q3 (Jul-Sep)': 0, 'Q4 (Oct-Dec)': 0 };

        expenseItems.forEach(expense => {
            if (expense.date) {
                const month = new Date(expense.date).getMonth();
                if (month <= 2) quarterTotals['Q1 (Jan-Mar)'] += Number(expense.amount);
                else if (month <= 5) quarterTotals['Q2 (Apr-Jun)'] += Number(expense.amount);
                else if (month <= 8) quarterTotals['Q3 (Jul-Sep)'] += Number(expense.amount);
                else quarterTotals['Q4 (Oct-Dec)'] += Number(expense.amount);
            } else {
                const month = new Date().getMonth();
                if (month <= 2) quarterTotals['Q1 (Jan-Mar)'] += Number(expense.amount);
                else if (month <= 5) quarterTotals['Q2 (Apr-Jun)'] += Number(expense.amount);
                else if (month <= 8) quarterTotals['Q3 (Jul-Sep)'] += Number(expense.amount);
                else quarterTotals['Q4 (Oct-Dec)'] += Number(expense.amount);
            }
        });

        const data = Object.entries(quarterTotals)
            .map(([name, value]) => ({ name, value }))
            .filter(d => d.value > 0);

        const finalData = data.length > 0 ? data : Object.entries(quarterTotals).map(([name, value]) => ({ name, value }));
        return { barData: finalData, pieData: finalData.filter(d => d.value > 0) };
    }

    const categoryTotals = expenseItems.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    return { barData: data, pieData: data };
};
