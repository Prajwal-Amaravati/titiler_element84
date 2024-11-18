// app/llm/llm_controller.ts

export class LlmController {
    public static postHello(message: string) {
        return `You said: ${message}`;
    }
}
