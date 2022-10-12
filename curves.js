
// Definimos las Bases de Berstein, dependen de u
function Base0(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3

function Base1(u) { return 3*(1-u)*(1-u)*u; } // 3*(1-u)*(u-u2) , 3*(u-u2-u2+u3), 3u -6u2+2u3

function Base2(u) { return 3*(1-u)*u*u;} //3u2-3u3

function Base3(u) { return u*u*u; }

// bases derivadas

function Base0der(u) { return -3*u*u+6*u-3;} //-3u2 +6u -3

function Base1der(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3

function Base2der(u) { return -9*u*u+6*u;}		 // -9u2 +6u

function Base3der(u) { return 3*u*u; }			// 3u2

function curvaCubica(u,puntosDeControl){

    var p0=puntosDeControl[0];
    var p1=puntosDeControl[1];
    var p2=puntosDeControl[2];
    var p3=puntosDeControl[3];

    var punto=new Object();

    punto.x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
    punto.y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
    punto.z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

    return punto;
}

function curvaCubicaDerivadaPrimera(u,puntosDeControl){

    var p0=puntosDeControl[0];
    var p1=puntosDeControl[1];
    var p2=puntosDeControl[2];
    var p3=puntosDeControl[3];

    var punto=new Object();

    punto.x=Base0der(u)*p0[0]+Base1der(u)*p1[0]+Base2der(u)*p2[0]+Base3der(u)*p3[0];
    punto.y=Base0der(u)*p0[1]+Base1der(u)*p1[1]+Base2der(u)*p2[1]+Base3der(u)*p3[1];
    punto.z=Base0der(u)*p0[2]+Base1der(u)*p1[2]+Base2der(u)*p2[2]+Base3der(u)*p3[2];

    return punto;
}

export {curvaCubica, curvaCubicaDerivadaPrimera};