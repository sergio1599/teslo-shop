import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';


export async function middleware(req: NextRequest) {

    try {
        await jose.jwtVerify(req.cookies.get('token') as string,
            new TextEncoder().encode(process.env.JWT_SECRET_SEED));
        return NextResponse.next();

    } catch (error) {
        const { protocol, host, pathname } = req.nextUrl
        return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
    }

}

export const config = {
    matcher: ['/checkout/:path*']
};


/* import { NextFetchEvent, NextResponse, NextRequest } from "next/server";
import { jwt } from "./utils";


export async function middleware(req: NextRequest, ev: NextFetchEvent) {

    const token = req.cookies.get('token') as string;


    try {
        await jwt.isValidToken(token);
        return NextResponse.next();
    } catch (error) {
        const requestedPage = req.page.name;
        return NextResponse.redirect(`auth/login?p=${requestedPage}`)
    }

}


export const config = {
    matcher: '/checkout/address',
}
 */

