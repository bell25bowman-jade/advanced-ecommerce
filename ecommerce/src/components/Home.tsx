import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addToCart } from "../store/cartSlice";
import { auth, storage } from "../client/FireBaseConfig";
import { loginUser } from "../UserProfile/Login";
import { logoutUser } from "../UserProfile/Logout";
import { registerUser } from "../UserProfile/RegisterUser";
import { getUserProfile } from "../UserProfile/Readprofile";
import { updateUserProfile } from "../UserProfile/updateProfile";
import { removeAccount } from "../UserProfile/deleteUser";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../products/useProducts";
import type { Product } from "../store/types/Products";

const EMPTY_PRODUCT = {
  title: "",
  price: 0,
  category: "",
  description: "",
  image: "",
};

export default function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [imageUrlError, setImageUrlError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setName("");
        setAddress("");
        return;
      }

      const profile = await getUserProfile(nextUser.uid);
      setName(profile?.name ?? "");
      setAddress(profile?.address ?? "");
    });

    return unsubscribe;
  }, []);

  const authLabel = useMemo(() => (user ? user.email : "Guest"), [user]);
  const redirectState = location.state as {
    authRequired?: boolean;
    from?: string;
  } | null;

  const submitAuth = async (mode: "login" | "register") => {
    if (!email || !password) return;

    if (mode === "register") {
      await registerUser(email, password);
      return;
    }

    await loginUser(email, password);
  };

  const saveProfile = async () => {
    if (!user) return;
    await updateUserProfile(user.uid, { name, address });
    alert("Profile updated.");
  };

  const uploadImageToStorage = async () => {
    if (!imageFile) {
      setImageUrlError("Select an image file first.");
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      setImageUrlError("Only image files are allowed.");
      return;
    }

    setIsUploadingImage(true);
    setImageUrlError("");

    try {
      const safeFileName = imageFile.name.replace(/\s+/g, "-");
      const owner = auth.currentUser?.uid ?? "guest";
      const storageRef = ref(
        storage,
        `products/${owner}/${Date.now()}-${safeFileName}`,
      );

      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);

      setProductForm((prev) => ({ ...prev, image: downloadUrl }));
      setImageFile(null);
    } catch {
      setImageUrlError(
        "Image upload failed. Check Firebase Storage rules and try again.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const submitProduct = async () => {
    if (!productForm.title || !productForm.category) return;

    const normalizedImage = productForm.image.trim();
    if (normalizedImage) {
      let parsed: URL;
      try {
        parsed = new URL(normalizedImage);
      } catch {
        setImageUrlError("Image must be a valid URL (http/https).");
        return;
      }

      if (!["http:", "https:"].includes(parsed.protocol)) {
        setImageUrlError("Image URL must start with http:// or https://");
        return;
      }
    }

    setImageUrlError("");

    const normalizedPayload = {
      ...productForm,
      price: Number(productForm.price),
      image: normalizedImage,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        payload: normalizedPayload,
      });
      setEditingProduct(null);
    } else {
      await createMutation.mutateAsync(normalizedPayload);
    }

    setProductForm(EMPTY_PRODUCT);
  };

  return (
    <div>
      <h1>Firebase E-Commerce</h1>
      <p>Signed in as: {authLabel}</p>
      {!user && redirectState?.authRequired && (
        <p>Please log in to access {redirectState.from ?? "that page"}.</p>
      )}

      <section>
        <h2>Authentication</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={() => submitAuth("register")}>Register</button>
        <button onClick={() => submitAuth("login")}>Login</button>
        <button onClick={() => logoutUser()}>Logout</button>
      </section>

      {user && (
        <section>
          <h2>Profile</h2>
          <input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <button onClick={saveProfile}>Save Profile</button>
          <button onClick={() => removeAccount(user)}>Delete Account</button>
        </section>
      )}

      <section>
        <h2>Products</h2>
        <input
          placeholder="Title"
          value={productForm.title}
          onChange={(event) =>
            setProductForm((prev) => ({ ...prev, title: event.target.value }))
          }
        />
        <input
          placeholder="Price"
          type="number"
          value={productForm.price}
          onChange={(event) =>
            setProductForm((prev) => ({
              ...prev,
              price: Number(event.target.value),
            }))
          }
        />
        <input
          placeholder="Category"
          value={productForm.category}
          onChange={(event) =>
            setProductForm((prev) => ({
              ...prev,
              category: event.target.value,
            }))
          }
        />
        <input
          placeholder="Description"
          value={productForm.description}
          onChange={(event) =>
            setProductForm((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
        />
        <input
          placeholder="Image URL"
          value={productForm.image}
          onChange={(event) =>
            setProductForm((prev) => ({ ...prev, image: event.target.value }))
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setImageFile(selected);
          }}
        />
        <button
          type="button"
          onClick={uploadImageToStorage}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? "Uploading..." : "Upload Image to Firebase"}
        </button>
        {imageUrlError && <p>{imageUrlError}</p>}
        {productForm.image.trim() && (
          <div>
            <p>Preview</p>
            <img
              src={productForm.image.trim()}
              alt="Product preview"
              width={120}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => {
                setImageUrlError(
                  "Could not load this image URL. Use a direct image link (for example ending in .jpg/.png/.webp).",
                );
              }}
              onLoad={() => {
                if (imageUrlError) {
                  setImageUrlError("");
                }
              }}
            />
          </div>
        )}
        <button onClick={submitProduct}>
          {editingProduct ? "Update Product" : "Create Product"}
        </button>

        {isLoading && <p>Loading products...</p>}
        {products.map((product) => (
          <div key={product.id} className="cart-item">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                width={120}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            {!product.image && <p>No image URL provided.</p>}
            <h3>{product.title}</h3>
            <p>${product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <button onClick={() => dispatch(addToCart(product))}>
              Add to Cart
            </button>
            <button
              onClick={() => {
                setEditingProduct(product);
                setProductForm({
                  title: product.title,
                  price: product.price,
                  category: product.category,
                  description: product.description,
                  image: product.image,
                });
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteMutation.mutate(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
