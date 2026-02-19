// Server-side venue utilities for Next.js metadata
// Uses direct API calls without browser APIs

async function fetchVenue(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/venues/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
}

export async function getVenueForMetadata(id: string) {
  return fetchVenue(id);
}

