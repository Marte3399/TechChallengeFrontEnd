import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import SelectPostModal from '@/components/Modal/SelectModal';

interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  user: {
    id: number;
    username: string;
  };
}

const PostItem = styled.li`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  align-items: flex-start;
`;

const PostImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
`;

const PostContent = styled.div`
  flex: 1;
`;

const PostUl = styled.ul`
  width: 75vh;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 10px;
`;

const PostDescription = styled.p`
  color: #666;
  margin-bottom: 10px;
`;

const PostAuthor = styled.p`
  color: #333;
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  color: #333;
`;

const Button = styled.button`
  padding: 5px 30px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonSearch = styled.button`
  padding: 5px 30px;
  margin: 5px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SelectButton = styled(Button)`
  background-color: #e0e0de;
  color: white;
  &:hover {
    background-color: #ffb300;
  }
`;

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/posts', {
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:4000/posts/search', {
        params: {
          keyword: searchQuery,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const openSelectModal = (id: number) => {
    setSelectedPostId(id);
    setIsSelectModalOpen(true);
  };

  const closeSelectModal = () => {
    setSelectedPostId(null);
    setIsSelectModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todas Postagens</h1>
      </div>
      <form onSubmit={handleSearch} className="flex mb-4">
        <SearchInput
          type="text"
          placeholder="Buscar postagens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <ButtonSearch type="submit">
            <FaSearch />
          </ButtonSearch>
        </div>
      </form>
      <ul>
        {posts.map((post) => (
          <PostItem key={post.id}>
            {post.imageUrl && (
              <PostImage src={post.imageUrl} alt={post.title} />
            )}
            <PostImage src="https://via.placeholder.com/150" alt="Placeholder Image" />
            <PostContent>
              <SelectButton onClick={() => openSelectModal(post.id)}>
                <PostTitle>{post.title}</PostTitle>
              </SelectButton>
              <PostDescription>
                {post.description.length > 300 
                  ? `${post.description.substring(0, 300)}...` 
                  : post.description}
              </PostDescription>

              <PostAuthor>Autor: {post.user.username}</PostAuthor>

            </PostContent>
          </PostItem>
        ))}
      </ul>
      <Footer />
      {selectedPostId && (
        <SelectPostModal
          isOpen={isSelectModalOpen}
          onClose={closeSelectModal}
          postId={selectedPostId}
        />
      )}
    </div>
  );
};

export default PostsPage;
