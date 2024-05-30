import { useState, useEffect } from 'react';
import axios from 'axios';

interface Repo {
  repo_name: string;
  repo_url: string;
  description: string;
}

const useGithubRepos = (username: string) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/conversations/github/public_repos`, {
          params: { username }
        });
        setRepos(response.data.linked_repos);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return { repos, loading, error };
};

export default useGithubRepos;
