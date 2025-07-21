import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 백엔드 서버로 요청 전송
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        // Authorization 헤더 추출
        const authHeader = response.headers.get('Authorization');
        console.log('Server-side Authorization header:', authHeader);
        
        // 응답 본문에 Authorization 토큰 포함
        const responseData = {
            ...data,
            accessToken: authHeader ? authHeader.replace('Bearer ', '') : null
        };

        console.log('Response data with token:', responseData);

        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
    } catch (error) {
        console.error('Login proxy error:', error);
        return NextResponse.json(
            { error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 