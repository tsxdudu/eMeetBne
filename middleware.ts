import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Rotas que precisam de autenticação
  const protectedRoutes = ['/servidor'];
  
  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Em uma implementação real, você verificaria um cookie ou token
    // Por enquanto, vamos redirecionar para login se não houver user no localStorage
    // (isso será verificado no lado do cliente)
    
    // Para testar: se não há cookie de usuário, redirecionar
    const userCookie = request.cookies.get('emeetbne-user');
    
    if (!userCookie) {
      // Redirecionar para login apenas se não estiver já indo para lá
      if (!request.nextUrl.pathname.startsWith('/login') && 
          !request.nextUrl.pathname.startsWith('/register')) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
