import React, { Suspense } from "react";
import Loading3dot from "../../components/loading/Loading3dot";
const PostDetail = React.lazy(() => import("./PostDetail"));

function PostDetailPage() {
  return (
    <>
      <Suspense fallback={<Loading3dot/>}>
        <PostDetail />
      </Suspense>
    </>
  );
}

export default PostDetailPage;
