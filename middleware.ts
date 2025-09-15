import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se é um acesso direto a um roomId (formato: /[uuid])
  // Padrão UUID: 8-4-4-4-12 caracteres hexadecimais
  const roomIdPattern = /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (roomIdPattern.test(pathname)) {
    // Extrair o roomId (remover a barra inicial)
    const roomId = pathname.slice(1);
    
    // Redirecionar para /room/[roomId] preservando query parameters
    const url = request.nextUrl.clone();
    url.pathname = `/room/${roomId}`;
    
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - room/ (páginas de sala válidas)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|room/).*)',
  ],
};