import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { ResetPasswordComponent } from "./pages/resetPassword/resetPassword.component";

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent
            },
            {
                path: 'resetpassword',
                component: ResetPasswordComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            },

        ]
    }
];
export default authRoutes;
