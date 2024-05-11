import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../../core/user/user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import LoginDTO from '../../core/auth/dto/login.dto';
import User from '../../core/user/entities/user.entity';
import RegisterDTO from '../../core/auth/dto/register.dto';
import { AuthService } from '../../core/auth/auth.service';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private userService: UserService, private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginDTO })
	@ApiOperation({ summary: 'Log in' })
	@ApiOkResponse({ description: 'Successfully logged in', type: User })
	@ApiUnauthorizedResponse({ description: 'Failed to log in' })
	async login(@Req() req: Request) {
		const token = await this.authService.login(req.user);
		const result = {
			token: token.access_token,
			user: req.user
		}
		return result;
	}

	@Get('profile')
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Post('register')
	@ApiOperation({ summary: 'Register' })
	@ApiBody({ type: RegisterDTO })
	@ApiOkResponse({ description: 'Successfully registered', type: User })
	async register(@Body() registerDto: RegisterDTO) {
		const password = registerDto.password; // Protect from mutating password during user creation
		await this.userService.create(registerDto);
		return await this.authService.validateUser(registerDto.email, password);
	}
}
