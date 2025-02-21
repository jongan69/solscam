// Function to fetch twitter followers
export const fetchFollowers = async (username: string) => {
    try {
        const response = await fetch('https://soltrendio.com/api/premium/twitter-followers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        if (!response.ok) return 0;
        const data = await response.json()
        return data || 0 // Add fallback to 0 if no followers returned
    } catch (error) {
        console.error('Error fetching followers:', error);
        return 0;
    }
}