import { useState, useEffect, useCallback } from "react";
import { confessionService } from "../services/confessionService";

export function useConfessions() {

  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshConfessions = useCallback(async () => {

    try {

      setLoading(true);

      const data = await confessionService.getConfessions();

      setConfessions(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Error fetching confessions", error);

      setConfessions([]);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    refreshConfessions();

  }, [refreshConfessions]);

  const addConfession = useCallback(async (text, category) => {

    const newConfession =
        await confessionService.addConfession(text, category);

    setConfessions(prev => [newConfession, ...prev]);

    return newConfession;

  }, []);

  const likeConfession = useCallback(async (id) => {

    const updated =
        await confessionService.likeConfession(id);

    setConfessions(prev =>
        prev.map(confession =>
            confession.id === id ? updated : confession
        )
    );

  }, []);

  const addComment = useCallback(async (confessionId, commentText) => {

    const updated =
        await confessionService.addComment(confessionId, commentText);

    setConfessions(prev =>
        prev.map(confession =>
            confession.id === confessionId
                ? updated
                : confession
        )
    );

    return updated;

  }, []);

  return {

    confessions,

    loading,

    refreshConfessions,

    addConfession,

    likeConfession,

    addComment

  };

}

export default useConfessions;