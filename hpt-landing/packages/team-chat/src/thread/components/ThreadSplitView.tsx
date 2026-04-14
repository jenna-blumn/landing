interface ThreadSplitViewProps {
  threadPane: React.ReactNode;
  sourcePane: React.ReactNode;
  sidePane?: React.ReactNode;
}

export default function ThreadSplitView({ threadPane, sourcePane, sidePane }: ThreadSplitViewProps): JSX.Element {
  return (
    <>
      {threadPane}
      {sourcePane}
      {sidePane}
    </>
  );
}
