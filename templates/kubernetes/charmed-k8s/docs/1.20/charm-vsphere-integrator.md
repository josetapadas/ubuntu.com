---
wrapper_template: "templates/docs/markdown.html"
markdown_includes:
  nav: kubernetes/charmed-k8s/docs/shared/_side-navigation.md
context:
  title: 'Vsphere-integrator charm '
  description: "Proxy charm to enable VMware vSphere integrations via Juju relations.\n"
keywords: component, charms, versions, release
tags:
    - reference
sidebar: k8smain-sidebar
permalink: 1.20/charm-vsphere-integrator.html
layout:
    - base
    - ubuntu-com
toc: false
charm_revision: '52'
bundle_release: '1.20'
---

This charm acts as a proxy to VMware vSphere and provides an [interface][] to
provide a set of credentials for a somewhat limited project user to the
applications that are related to this charm.

## Usage

When on a vSphere cloud, this charm can be deployed, granted trust via Juju to
access vSphere, and then related to an application that supports the
[interface][].

For example, [Charmed Kubernetes][] has support for this, and can be
deployed with the following bundle overlay:

```yaml
applications:
  vsphere-integrator:
    charm: cs:~containers/vsphere-integrator
    num_units: 1
relations:
  - ['vsphere-integrator', 'kubernetes-master']
  - ['vsphere-integrator', 'kubernetes-worker']
```

Using Juju 2.4 or later:

```bash
juju deploy cs:charmed-kubernetes --overlay ./k8s-vsphere-overlay.yaml
juju trust vsphere-integrator
```

To deploy with earlier versions of Juju, you will need to provide the cloud
credentials via the `credentials` charm config option:

```bash
cat <<EOJ > /path/to/cloud.json
{
  "vsphere_ip": "a.b.c.d",
  "user": "joe",
  "password": "passw0rd",
  "datacenter": "dc0"
}
EOJ

juju config vsphere-integrator credentials="$(base64 /path/to/cloud.json)"
```

## Configuration

This charm supports multiple config options that can be used to describe they
vSphere environment.

The only required option is `datastore`, as it is not included in the Juju
credential that this charm relies on. By default, this is set to *datastore1*.
This can be changed with:

```bash
juju config vsphere-integrator datastore='mydatastore'
```

You may also configure a *folder* and *resource pool path* for this charm.
Details about these options can be found in the [vmware documentation][]:

```bash
juju config vsphere-integrator folder='juju-kubernetes' respool_path='foo'
```

As mentioned in the **Usage** section, `credentials` may be set with a
base64-encoded json file. When set, this data will take precedent over all
other methods of specifying credentials for this charm.

If `credentials` is empty, there are config options for each key that
constitute a Juju credential. These can be set with:

```bash
juju config vsphere-integrator \
  vsphere_ip='a.b.c.d' \
  user='joe' \
  password='passw0rd' \
  datacenter='dc0'
```

>Note: If any of the credential config options are set, they must all be set.

When all of the credential config options are empty, this charm will fall
back to the credential data it received with `juju trust vsphere-integrator`.


<!-- CONFIG STARTS -->
<!--AUTOGENERATED CONFIG TEXT - DO NOT EDIT -->


| name | type   | Default      | Description                               |
|------|--------|--------------|-------------------------------------------|
| <a id="table-credentials"> </a> credentials | string |  | [See notes](#credentials-description)  |
| <a id="table-datacenter"> </a> datacenter | string |  | vSphere datacenter name. In the vCenter control panel, this can be found at Inventory Lists > Resources > Datacenters.  |
| <a id="table-datastore"> </a> datastore | string | datastore1 | Datastore to use for provisioning volumes using storage classes and persistent volume claims. Defaults to 'datastore1'.  |
| <a id="table-folder"> </a> folder | string | juju-kubernetes | Virtual center VM folder path under the datacenter. Defaults to 'juju-kubernetes'. This value must not be empty.  |
| <a id="table-password"> </a> password | string |  | Password of a valid vSphere user.  |
| <a id="table-respool_path"> </a> respool_path | string |  | Path to resource pool under the datacenter.  |
| <a id="table-user"> </a> user | string |  | Username of a valid vSphere user.  |
| <a id="table-vsphere_ip"> </a> vsphere_ip | string |  | IP address of the vSphere server.  |

---

### credentials


<a id="credentials-description"> </a>
**Description:**

The base64-encoded contents of a JSON file containing vSphere credentials.

The credentials must contain the following keys: vsphere_ip, user,
password, datacenter, and datastore.

This can be used from bundles with 'include-base64://' (see
https://docs.jujucharms.com/2.4/en/charms-bundles#setting-charm-configuration-options-in-a-bundle),
or from the command-line with 'juju config vsphere credentials="$(base64 /path/to/file)"'.

It is strongly recommended that you use 'juju trust' instead, if available.

[Back to table](#table-credentials)



<!-- CONFIG ENDS -->





## Resource Usage Note

By relating to this charm, other charms can directly allocate resources, such
as PersistentDisk volumes, which could lead to cloud charges and count against
quotas.  Because these resources are not managed by Juju, they will not be
automatically deleted when the models or applications are destroyed, nor will
they show up in Juju's status or GUI.  It is therefore up to the operator to
manually delete these resources when they are no longer needed, using the
vCenter console or API.

## Examples

The following are some examples using vSphere integration with Charmed
Kubernetes.

### Creating a pod with a PersistentDisk-backed volume

This script creates a busybox pod with a persistent volume claim backed by
vSphere's PersistentDisk.

```bash
#!/bin/bash

# create a storage class using the `kubernetes.io/vsphere-volume` provisioner
kubectl create -f - <<EOY
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mystorage
provisioner: kubernetes.io/vsphere-volume
parameters:
  diskformat: zeroedthick
EOY

# create a persistent volume claim using that storage class
kubectl create -f - <<EOY
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: testclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
  storageClassName: mystorage
EOY

# create the busybox pod with a volume using that PVC:
kubectl create -f - <<EOY
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
    - image: busybox
      command:
        - sleep
        - "3600"
      imagePullPolicy: IfNotPresent
      name: busybox
      volumeMounts:
        - mountPath: "/pv"
          name: testvolume
  restartPolicy: Always
  volumes:
    - name: testvolume
      persistentVolumeClaim:
        claimName: testclaim
EOY
```

<!-- ACTIONS STARTS -->

<!-- ACTIONS ENDS -->


[interface]: https://github.com/juju-solutions/interface-vsphere-integration
[Charmed Kubernetes]: https://jaas.ai/charmed-kubernetes
[vmware documentation]: https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/existing.html
