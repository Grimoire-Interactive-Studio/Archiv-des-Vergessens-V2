/**
 * Schaltet das nächste Story-Kapitel frei.
 */
export function advanceStory() {
  return (state) => {
    const currentChapter = state.story.currentChapter || 0;
    const maxChapter = state.story.maxChapter || 0;

    if (currentChapter >= maxChapter) return state;

    return {
      ...state,
      story: {
        ...state.story,
        currentChapter: currentChapter + 1
      }
    };
  };
}
