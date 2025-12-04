const STORAGE_KEY = 'code_review_history';
const MAX_HISTORY_ITEMS = 50;

export const saveReviewToHistory = (reviewData) => {
    try {
        const history = getReviewHistory();
        const newReview = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...reviewData,
        };

        const updatedHistory = [newReview, ...history].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return newReview;
    } catch (error) {
        console.error('Failed to save review to history:', error);
        return null;
    }
};

export const getReviewHistory = () => {
    try {
        const history = localStorage.getItem(STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Failed to get review history:', error);
        return [];
    }
};

export const deleteReviewFromHistory = (id) => {
    try {
        const history = getReviewHistory();
        const updatedHistory = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Failed to delete review from history:', error);
        return false;
    }
};

export const clearReviewHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear review history:', error);
        return false;
    }
};

export const getReviewById = (id) => {
    const history = getReviewHistory();
    return history.find(item => item.id === id);
};
