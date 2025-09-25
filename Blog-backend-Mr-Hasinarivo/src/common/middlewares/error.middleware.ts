import { AbstractHttpAdapter } from '@nestjs/core';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';
import { isArray } from 'class-validator';
import { ThrottlerException } from '@nestjs/throttler';
@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}

  catch(exception: any, host: ArgumentsHost): void {
    let errorMessage: any;
    let httpStatus: number;
    const httpAdapter = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof ThrottlerException) {
      httpStatus = 429;
      errorMessage = 'Trop de requêtes, veuillez réessayer plus tard.';
    } else if (exception instanceof PrismaClientRustPanicError) {
      httpStatus = 400;
      console.log('exception', exception.message);
      errorMessage = 'Erreur critique de Prisma. Veuillez réessayer plus tard.';
    } else if (exception instanceof PrismaClientValidationError) {
      httpStatus = 422;
      console.log('exception', exception.message);

      errorMessage = 'Erreur de validation des données.';
    } else if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus = 400;
      switch (exception.code) {
        case 'P2002':
          errorMessage = `Le champ '${exception.meta?.target?.[0] || 'Inconnu'}' doit être unique. Veuillez vérifier vos données.`;
          break;
        case 'P2025':
          errorMessage = `Aucune donnée trouvée correspondant à votre requête.`;
          httpStatus = 404;
          break;
        case 'P2003':
          errorMessage = `Violation de contrainte de clé étrangère sur '${exception.meta?.target?.[0] || 'Inconnu'}'.`;
          break;
        case 'P2014':
          errorMessage = `Violation d'intégrité relationnelle.`;
          break;
        case 'P2000':
          errorMessage = `Valeur trop longue pour le champ '${exception.meta?.target?.[0] || 'Inconnu'}'.`;
          break;
        default:
          errorMessage = exception.message;
      }
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      httpStatus = 400;
      errorMessage =
        "Erreur inconnue de Prisma. Veuillez contacter l'administrateur.";
    } else if (exception instanceof PrismaClientInitializationError) {
      httpStatus = 500;
      errorMessage =
        "Erreur d'initialisation de Prisma. Veuillez vérifier la connexion à la base de données.";
    } else if (exception instanceof NotFoundException) {
      httpStatus = 404;
      errorMessage = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      httpStatus = 403;
      const messages = (exception.getResponse() as any)?.message;
      errorMessage = isArray(messages) ? messages.join(' & ') : messages;
    } else if (exception instanceof ForbiddenException) {
      httpStatus = 403;
      errorMessage =
        (exception.getResponse() as any)?.message ||
        "Accès interdit. Vous n'avez pas les permissions nécessaires.";
    } else if (exception instanceof ConflictException) {
      httpStatus = 409;
      // console.log("exception.message",exception);
      // console.log("exception.response",exception.message);

      errorMessage =
        exception.message ??
        "Conflit de données. L'opération demandée ne peut pas être effectuée.";
    } else if (exception instanceof BadRequestException) {
      const messages = (exception.getResponse() as any)?.message;
      errorMessage = isArray(messages) ? messages.join(' & ') : messages;
      httpStatus = exception.getStatus();
    } else {
      console.log('Erreur non gérée :', exception);
      if (exception.code === 'EDNS') {
        httpStatus = 500;
        errorMessage = 'Le service de messagerie ne fonctionne pas.';
      } else {
        httpStatus = 500;
        errorMessage =
          "Une erreur interne s'est produite. Veuillez réessayer plus tard.";
      }
    }

    const errorResponse = {
      message:
        typeof errorMessage === 'string'
          ? errorMessage.split('\n\n').at(-1)
          : errorMessage,
      success: false,
      status: httpStatus,
      data: null,
    };

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
