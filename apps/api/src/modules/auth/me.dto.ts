import { ApiProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  subscription: string;
  @ApiProperty()
  isActivated: boolean;
  @ApiProperty()
  usedTokens: number;
  @ApiProperty({ type: Date })
  tokenCountResetDate: Date | null;
  @ApiProperty()
  tokenLimit: number;
}
