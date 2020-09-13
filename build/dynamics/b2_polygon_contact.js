/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../collision/b2_collide_polygon.js", "./b2_contact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_collide_polygon_js_1, b2_contact_js_1, b2PolygonContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_collide_polygon_js_1_1) {
                b2_collide_polygon_js_1 = b2_collide_polygon_js_1_1;
            },
            function (b2_contact_js_1_1) {
                b2_contact_js_1 = b2_contact_js_1_1;
            }
        ],
        execute: function () {
            b2PolygonContact = class b2PolygonContact extends b2_contact_js_1.b2Contact {
                static Create() {
                    return new b2PolygonContact();
                }
                static Destroy(contact) {
                }
                Evaluate(manifold, xfA, xfB) {
                    b2_collide_polygon_js_1.b2CollidePolygons(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
                }
            };
            exports_1("b2PolygonContact", b2PolygonContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcG9seWdvbl9jb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX3BvbHlnb25fY29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBUUYsbUJBQUEsTUFBYSxnQkFBaUIsU0FBUSx5QkFBeUM7Z0JBQ3RFLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztnQkFDaEMsQ0FBQztnQkFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWtCO2dCQUN4QyxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0I7b0JBQ3RFLHlDQUFpQixDQUNmLFFBQVEsRUFDUixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLENBQUM7YUFDRixDQUFBIn0=