import { NextResponse } from "next/server";
import clientPromise from '../../../lib/mongodb';

export async function POST(request) {
    try {
      const client = await clientPromise;
      const db = client.db("photoproject");

      const data = await request.json(); // Parsing the JSON body from the request

      if (!data || !data.length) {
        // Here we directly return a response with status 400
        return new NextResponse(JSON.stringify({ message: 'No image data provided' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      const collection = db.collection("images");
      const result = await collection.insertMany(data);

      // Here we directly return a response with status 201 and the result as JSON
      return NextResponse.json(result);

    } catch (error) {
      // Here we directly return a response with status 500
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
}
