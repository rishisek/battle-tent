// import server from "./app";

// server.listen(5000, () => {
//   console.log("UP");
// });
import k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

k8sApi.listNamespacedPod("default").then((res) => {
  // tslint:disable-next-line:no-console
  console.log(res.body);
});

// Example of instantiating a Pod object.
const pod = {
  kind: "Pod",
  apiVersion: "v1",
  metadata: { name: "foo", labels: { app: "foo" } },
  spec: {
    containers: [
      {
        name: "foo",
        image: "hashicorp/http-echo:0.2.3",
        args: ["-text=foo"],
        ports: [{ containerPort: 5678 }],
      },
    ],
  },
} as k8s.V1Pod;
const namespace = "default";
k8sApi.createNamespacedPod(namespace, pod);
console.log(pod);
