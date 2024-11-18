// app/llm/llm_view.ts
import { LlmController } from './hello_world_controller';

export class LlmView {
    public static async handleRequest(reqBody: any): Promise<any> {
        try {
            const message = reqBody.message;

            // Validate the request body
            if (!message || typeof message !== 'string') {
                return { error: 'Invalid message' };
            }

            const response = LlmController.postHello(message);
            return { response };
        } catch (error) {
            console.error('Error handling request:', error);
            return { error: 'Internal Server Error' };
        }
    }
}
