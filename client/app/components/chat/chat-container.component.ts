import { Component } from '@angular/core';

@Component({
  selector: 'chat-container',
  template: `
  <div class="chatcontainer">
    <h3>We advise you to first carefully read the self-help section, as this might provide a solution to the issue(s) you may be experiencing.</h3>

    <chat></chat>
  </div>

  `,
  styleUrls: ['./dist/assets/css/chatcontainer.css']
})

export class ChatContainerComponent {}
