export interface ApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

export const fetchVerses = async (userInput: string, bibleVersion: string = 'KJV'): Promise<string[]> => {
  try {
    const apiKey = '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';
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Map Bible version codes to their full names
    const bibleVersionNames: { [key: string]: string } = {
      'KJV': 'King James Version of the Bible',
      'NIV': 'New International Version of the Bible',
      'ESV': 'English Standard Version of the Bible',
      'NLT': 'New Living Translation of the Bible',
      'MSG': 'The Message Version of the Bible'
    };

    const fullBibleVersion = bibleVersionNames[bibleVersion] || 'King James Version of the Bible';

    const requestBody = {
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "user",
          content: `Search for the solution of the problem: ${userInput} and give 21 direct answers in the form of Bible verses from the ${fullBibleVersion} that sympathize and provide guidance. For each verse, expand on its meaning with an additional 20-30 words of explanation or context while preserving the original message. Make sure each verse and explanation are clearly connected.`
        }
      ]
    };

    console.log('Sending request to OpenRouter API...');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'} (Status: ${response.status})`);
    }

    const data = await response.json() as ApiResponse;
    
    // Check if API returned an error
    if (data.error) {
      console.error('API Error:', data.error);
      throw new Error(`API Error: ${data.error.message} (Code: ${data.error.code})`);
    }
    
    // Check if choices array exists and has content
    if (!data.choices || !data.choices.length || !data.choices[0]?.message?.content) {
      console.log('API Response:', JSON.stringify(data, null, 2));
      throw new Error('No content received from API');
    }

    const content = data.choices[0].message.content;
    
    // Split the response into individual verses
    // This regex looks for numbered items like "1." or "21." at the beginning of a line
    const verses = content.split(/\d+\.\s+/).filter(verse => verse.trim().length > 0);
    
    // Filter out any "*" symbols from the verses
    const cleanedVerses = verses.map(verse => verse.replace(/\*/g, ''));
    
    // If no verses were extracted, try providing the whole content as a single verse
    if (cleanedVerses.length === 0) {
      return [content.replace(/\*/g, '')];
    }
    
    return cleanedVerses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }
};

