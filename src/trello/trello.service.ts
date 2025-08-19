// trello.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { CreateListDto, UpdateListDto } from './dto/create-list.dto';
import { CreateCardDto, UpdateCardDto } from './dto/create-card.dto';
import { Board, List, Card } from '@prisma/client';

@Injectable()
export class TrelloService {
  constructor(private prisma: PrismaService) {}

  // BOARDS
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: createBoardDto,
      include: { lists: { include: { cards: true } } }
    });
  }

  async findAllBoards(): Promise<Board[]> {
    return this.prisma.board.findMany({
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
              include: { labels: true, attachments: true, comments: true }
            }
          }
        }
      }
    });
  }

  async findOneBoard(id: string): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
              include: { labels: true, attachments: true, comments: true }
            }
          }
        }
      }
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  async updateBoard(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: { lists: { include: { cards: true } } }
    });
  }

  async removeBoard(id: string): Promise<Board> {
    return this.prisma.board.delete({
      where: { id }
    });
  }

  // LISTS
  async createList(createListDto: CreateListDto): Promise<List> {
    const maxPosition = await this.prisma.list.findFirst({
      where: { boardId: createListDto.boardId },
      orderBy: { position: 'desc' }
    });

    return this.prisma.list.create({
      data: {
        ...createListDto,
        position: (maxPosition?.position || 0) + 1
      },
      include: { cards: { include: { labels: true } } }
    });
  }

  async updateList(id: string, updateListDto: UpdateListDto): Promise<List> {
    return this.prisma.list.update({
      where: { id },
      data: updateListDto,
      include: { cards: { include: { labels: true } } }
    });
  }

  async removeList(id: string): Promise<List> {
    return this.prisma.list.delete({
      where: { id }
    });
  }

  async reorderLists(boardId: string, listIds: string[]): Promise<void> {
    const updates = listIds.map((listId, index) =>
      this.prisma.list.update({
        where: { id: listId },
        data: { position: index + 1 }
      })
    );

    await Promise.all(updates);
  }

  // CARDS
  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const maxPosition = await this.prisma.card.findFirst({
      where: { listId: createCardDto.listId },
      orderBy: { position: 'desc' }
    });

    return this.prisma.card.create({
      data: {
        ...createCardDto,
        position: (maxPosition?.position || 0) + 1
      },
      include: { labels: true, attachments: true, comments: true }
    });
  }

  async updateCard(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
      include: { labels: true, attachments: true, comments: true }
    });
  }

  async removeCard(id: string): Promise<Card> {
    return this.prisma.card.delete({
      where: { id }
    });
  }

  async moveCard(cardId: string, newListId: string, newPosition: number): Promise<Card> {
    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        listId: newListId,
        position: newPosition
      },
      include: { labels: true, attachments: true, comments: true }
    });
  }

  async reorderCards(listId: string, cardIds: string[]): Promise<void> {
    const updates = cardIds.map((cardId, index) =>
      this.prisma.card.update({
        where: { id: cardId },
        data: { position: index + 1 }
      })
    );

    await Promise.all(updates);
  }

  // LABELS
  async addLabel(cardId: string, labelData: { name: string; color: string }) {
    return this.prisma.label.create({
      data: {
        ...labelData,
        cardId
      }
    });
  }

  async removeLabel(labelId: string) {
    return this.prisma.label.delete({
      where: { id: labelId }
    });
  }

  // COMMENTS
  async addComment(cardId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        cardId
      }
    });
  }

  async removeComment(commentId: string) {
    return this.prisma.comment.delete({
      where: { id: commentId }
    });
  }
}