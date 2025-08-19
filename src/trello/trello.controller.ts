// trello.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { CreateListDto, UpdateListDto } from './dto/create-list.dto';
import { CreateCardDto, UpdateCardDto } from './dto/create-card.dto';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  // BOARDS
  @Post('boards')
  createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.trelloService.createBoard(createBoardDto);
  }

  @Get('boards')
  findAllBoards() {
    return this.trelloService.findAllBoards();
  }

  @Get('boards/:id')
  findOneBoard(@Param('id') id: string) {
    return this.trelloService.findOneBoard(id);
  }

  @Patch('boards/:id')
  updateBoard(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.trelloService.updateBoard(id, updateBoardDto);
  }

  @Delete('boards/:id')
  removeBoard(@Param('id') id: string) {
    return this.trelloService.removeBoard(id);
  }

  // LISTS
  @Post('lists')
  createList(@Body() createListDto: CreateListDto) {
    return this.trelloService.createList(createListDto);
  }

  @Patch('lists/:id')
  updateList(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.trelloService.updateList(id, updateListDto);
  }

  @Delete('lists/:id')
  removeList(@Param('id') id: string) {
    return this.trelloService.removeList(id);
  }

  @Put('boards/:boardId/lists/reorder')
  reorderLists(@Param('boardId') boardId: string, @Body() { listIds }: { listIds: string[] }) {
    return this.trelloService.reorderLists(boardId, listIds);
  }

  // CARDS
  @Post('cards')
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.trelloService.createCard(createCardDto);
  }

  @Patch('cards/:id')
  updateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.trelloService.updateCard(id, updateCardDto);
  }

  @Delete('cards/:id')
  removeCard(@Param('id') id: string) {
    return this.trelloService.removeCard(id);
  }

  @Put('cards/:id/move')
  moveCard(@Param('id') id: string, @Body() { listId, position }: { listId: string; position: number }) {
    return this.trelloService.moveCard(id, listId, position);
  }

  @Put('lists/:listId/cards/reorder')
  reorderCards(@Param('listId') listId: string, @Body() { cardIds }: { cardIds: string[] }) {
    return this.trelloService.reorderCards(listId, cardIds);
  }

  // LABELS
  @Post('cards/:cardId/labels')
  addLabel(@Param('cardId') cardId: string, @Body() labelData: { name: string; color: string }) {
    return this.trelloService.addLabel(cardId, labelData);
  }

  @Delete('labels/:id')
  removeLabel(@Param('id') id: string) {
    return this.trelloService.removeLabel(id);
  }

  // COMMENTS
  @Post('cards/:cardId/comments')
  addComment(@Param('cardId') cardId: string, @Body() { content }: { content: string }) {
    return this.trelloService.addComment(cardId, content);
  }

  @Delete('comments/:id')
  removeComment(@Param('id') id: string) {
    return this.trelloService.removeComment(id);
  }
}