import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, business, audience } = await req.json();

    console.log('Received request:', { email, business, audience });

    // Instead of generating content, we'll return the iframe HTML
    const iframeHtml = `<iframe src="https://mvpbuilder.substack.com/embed" width="480" height="320" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>`;

    const response = {
      content: iframeHtml,
      message: "Please subscribe to our newsletter for more content."
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Detailed error:', error as Error);
    return NextResponse.json({ error: 'Failed to process request', details: (error as Error).message }, { status: 500 });
  }
}




// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Ensure the API key is set
// if (!process.env.GOOGLE_GEMINI_API_KEY) {
//   throw new Error('GOOGLE_GEMINI_API_KEY is not set');
// }

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { email, business, audience } = await req.json();

//     console.log('Received request:', { email, business, audience });

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `
//       For a ${business} targeting ${audience}, generate:
//       1. 3 User Acquisition Ideas to get high-quality traffic
//       2. 3 Content Marketing Ideas to nurture the audience
//       3. 3 Conversion Rate Optimization Ideas to turn visitors into customers
//       Format the response as a JSON object with keys: userAcquisitionIdeas, contentMarketingIdeas, conversionOptimizationIdeas.
//       Each key should have an array of 3 string ideas.
//       Return only the JSON object, without any markdown formatting or additional text.
//     `;

//     console.log('Sending request to Gemini');
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log('Received response from Gemini:', text);

//     // Extract JSON from the response if it's wrapped in a code block
//     const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
//     const jsonString = jsonMatch ? jsonMatch[1] : text;

//     // Parse the extracted or raw JSON
//     const parsedResult = JSON.parse(jsonString);

//     return NextResponse.json(parsedResult);
//   } catch (error) {
//     console.error('Detailed error:', error as Error);
//     return NextResponse.json({ error: 'Failed to generate extra content', details: (error as Error).message }, { status: 500 });
//   }
// }