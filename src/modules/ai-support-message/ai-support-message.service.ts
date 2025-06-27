import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAiSupportMessageDto } from './dto/create-ai-support-message.dto';
import { UpdateAiSupportMessageDto } from './dto/update-ai-support-message.dto';
import { CohereService } from '../../common/cohere/cohere.service';

@Injectable()
export class AiSupportMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cohereService: CohereService,
  ) {}

  async create(data: CreateAiSupportMessageDto, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id: data.chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Access denied to this chat');

    return this.prisma.ai_support_messages.create({
      data: {
        chat_id: data.chatId,
        role: data.role, // "user" o "assistant"
        content: data.content,
        status: typeof data.status === 'number' ? data.status : 0,
      },
    });
  }

  async chatWithAI(
    chatId: number,
    userId: number,
    prompt: string,
  ): Promise<string> {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id: chatId },
    });
    if (!chat) throw new NotFoundException('Chat no encontrado');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Acceso denegado');
    if (prompt.length > 600) {
      throw new Error('La pregunta es demasiado larga. Intenta resumirla.');
    }
    const systemInstructions = `
  Eres Aurora, una inteligencia artificial de soporte en español para la plataforma web Aurora Connect.
  Tu objetivo es asistir a los usuarios (clientes y técnicos) resolviendo dudas sobre cómo usar la app
  y sugerir precios aproximados según la descripción de un problema técnico.
  
  Importante:
  - Responde SIEMPRE en español claro y profesional.
  - Si te preguntan algo fuera del contexto de Aurora Connect, responde:
    "Lo siento, solo puedo ayudarte con temas relacionados a Aurora Connect".
  
  ¿Cómo funciona Aurora Connect para TÉCNICOS?
  1. Recibe solicitudes de clientes con problemas técnicos.
  2. Envía propuestas con precio, disponibilidad y mensaje personalizado.
  3. Si el cliente acepta, abre el chat y resuelve el problema.
  4. Administra tickets, solicitudes y tu historial desde tu panel.
  5. Recibe valoraciones visibles de los clientes.
  6. Mejora tu perfil actualizando experiencia y habilidades.
  
  ¿Cómo funciona para USUARIOS?
  1. Publica tu problema técnico y añade detalles.
  2. Recibe propuestas de varios técnicos con precio y condiciones.
  3. Acepta una propuesta, chatea y resuelve tu problema.
  4. Haz seguimiento desde el ticket generado por la solicitud.
  5. Valora al técnico y deja un comentario.
  6. Confía: todos los técnicos están verificados y evaluados.
  
  Usuario: ${prompt}
  Aurora:
  `;
    await this.prisma.ai_support_messages.create({
      data: {
        chat_id: chatId,
        role: 'usuario',
        content: prompt,
      },
    });
    const response =
      await this.cohereService.generateResponse(systemInstructions);
    await this.prisma.ai_support_messages.create({
      data: {
        chat_id: chatId,
        role: 'asistente',
        content: response,
      },
    });

    return response;
  }

  async findAllForChat(chatId: number, userId: number) {
    const chat = await this.prisma.ai_support_chats.findUnique({
      where: { id: chatId },
    });

    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.user_id !== userId)
      throw new ForbiddenException('Access denied to chat messages');

    return this.prisma.ai_support_messages.findMany({
      where: { chat_id: chatId },
      include: { chat: true },
      orderBy: { sent_at: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('Access denied to this message');

    return msg;
  }

  async update(id: number, data: UpdateAiSupportMessageDto, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('You can only update your own AI messages');

    return this.prisma.ai_support_messages.update({
      where: { id },
      data: {
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    const msg = await this.prisma.ai_support_messages.findUnique({
      where: { id },
      include: { chat: true },
    });

    if (!msg) throw new NotFoundException('Message not found');
    if (msg.chat.user_id !== userId)
      throw new ForbiddenException('You can only delete your own AI messages');

    return this.prisma.ai_support_messages.delete({
      where: { id },
    });
  }
}
