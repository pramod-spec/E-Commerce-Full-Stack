import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";


export async function GET() {
    const token = (await cookies()).get("token")?.value

    
    if(!token){
        return Response.json( {user :null}, {status:401})
    }

    try{
        const decoded = verifyToken(token)
        return Response.json({user:decoded})
    }catch{
        return Response.json( {user:null}, {status:401})
    }
}