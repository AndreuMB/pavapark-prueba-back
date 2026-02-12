import { Controller, Get } from '@nestjs/common';

@Controller('mock')
export class MockController {
  @Get('temp-format-a')
  getTempFormatA() {
    return [
      {
        sensorCode: '698d80c1dc6c175639f6a0a0',
        ts: new Date().toISOString(),
        valueC: 21.4,
      },
    ];
  }

  @Get('temp-format-b')
  getTempFormatB() {
    return {
      deviceId: '698d80c1dc6c175639f6a0a0',
      data: [
        {
          time: Math.floor(Date.now() / 1000),
          temp: 21.4,
        },
      ],
    };
  }
}
