import { getPost } from '@/api/posts';
import MarkdownViewer from '@/components/MarkdownViewer';
import Thumbnail from '@/components/Thumbnail';
import { BsFillCalendar2DayFill } from 'react-icons/bs';

export default async function Post() {
    const { metadata, content } = await getPost('test');
    return (
        <div>
            <Thumbnail
                src={metadata.thumbnail}
                title={metadata.title}
                desc={metadata.description}
            />
            <div className="flex items-end justify-between py-8">
                <h1 className="border-b-4 border-b-midnightNavy">{metadata.title}</h1>
                <div className="flex items-center gap-4 text-xl text-deepOceanBlue">
                    <BsFillCalendar2DayFill />
                    <div>{metadata.date}</div>
                </div>
            </div>
            <p className="line-clamp-1 text-gray-500">{metadata.description}</p>
            <MarkdownViewer content={content} className="mt-4 rounded-md bg-frostedWhite p-4" />
        </div>
    );
}
