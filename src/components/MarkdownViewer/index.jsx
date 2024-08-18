import { cn } from '@/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content, className }) {
    return (
        <ReactMarkdown className={cn('prose', className)} remakrPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    );
}
