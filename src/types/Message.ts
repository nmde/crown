/**
 * @file Message type definition.
 */
export default interface IMessage {
  sender: string;
  content: string;
  time: string;
  recipient: string;
  id?: string;
}
