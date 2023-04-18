import * as admin from "firebase-admin";

export const resolvers = {
  Query: {
    async tests() {
      const tests = await admin.firestore().collection("tests").get();
      return tests.docs.map((test) => test.data());
    },

    async user(_parent: any, { id }: any, _: any) {
      console.log("user id:" + id)
      const user = await admin.firestore().collection("Users").doc(id).get();
      console.log("user:" + user);
      return user.data();
    },

    async users() {
      const users = await admin.firestore().collection("Users").get();
      return users.docs.map((user) => user.data());
    },

    async threads(_parent: any, { limit, lastDocId }: any, _: any) {
      console.log("threads limit:" + limit)
      console.log("threads lastDocId:" + lastDocId)

      let threads;
      if (lastDocId === "") {
        console.log("threads lastDocId指定なし")
        threads = await admin.firestore().collection("Threads")
          .orderBy("createdAt", "desc")
          .limit(limit + 1)
          .get();
      } else {
        console.log("threads lastDocId指定あり")
        threads = await admin.firestore().collection("Threads")
          .orderBy("createdAt", "desc")
          .limit(limit + 1)
          .startAfter(lastDocId)
          .get();
      }


      const array = Array()

      await Promise.all(threads.docs.map(async (thread) => {
        let data = thread.data();

        // ユーザー情報をつめる
        const user = await admin.firestore().collection("Users").doc(data.userId).get();
        data.user = user.data();
        array.push(data)
      }));

      const length = array.length;
      let nextPageStartDocId = "";

      // 次のページがあるかどうか
      if (length == limit + 1) {
        const lastData = array[limit];
        nextPageStartDocId = lastData.id;
        array.pop();
      }

      return {
        threads: array,
        nextDocId: nextPageStartDocId};
    },

    async posts(_parent: any, {threadId, limit, lastDocId }: any, _: any) {
      let posts;
      if (lastDocId === "") {
        console.log("posts lastDocId指定なし")
        posts = await admin.firestore().collection("Threads").doc(threadId).collection("Posts")
          .orderBy("createdAt", "desc")
          .limit(limit + 1)
          .get();
      } else {
        console.log("posts lastDocId指定あり")
        posts = await admin.firestore().collection("Threads").doc(threadId).collection("Posts")
          .orderBy("createdAt", "desc")
          .limit(limit + 1)
          .startAfter(lastDocId)
          .get();
      }

      const array = Array()

      await Promise.all(posts.docs.map(async (post) => {
        let data = post.data();

        // ユーザー情報をつめる
        const user = await admin.firestore().collection("Users").doc(data.userId).get();
        data.user = user.data();
        array.push(data)
      }));

      const length = array.length;
      let nextPageStartDocId = "";

      // 次のページがあるかどうか
      if (length == limit + 1) {
        const lastData = array[limit];
        nextPageStartDocId = lastData.id;
        array.pop();
      }

      return {
        posts: array,
        nextDocId: nextPageStartDocId};
    }
  },

  Mutation: {
    async registUser(_parent : any, {id, name, bio} : any, _ : any) {
      const userRef = admin.firestore().collection("Users").doc(id)
      await userRef.set({
        id: id,
        name: name,
        bio:bio
      })

      const doc = await admin.firestore().doc(`Users/${id}`).get();
      const user = doc.data();
      return user;
    },

    async updateUser(_parent : any, {id, name, bio} : any, _ : any) {
      const userRef = admin.firestore().collection("Users").doc(id)
      await userRef.set({
        name: name,
        bio:bio
      }, {merge: true})

      const doc = await admin.firestore().doc(`Users/${id}`).get();
      const user = doc.data();
      return user;
    }
  }
 }