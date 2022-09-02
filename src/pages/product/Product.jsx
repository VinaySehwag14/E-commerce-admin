import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import PublishIcon from "@mui/icons-material/Publish";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { updateProduct } from "../../redux/apiCalls";

const Product = () => {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.product);

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  //* creating a unique name to overcome replacing error it replaces same name things
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setMessage("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            setMessage("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            setMessage("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log({ ...inputs, img: downloadURL, categories: cat });
          const product = {
            ...data,
            img: downloadURL,
            category: categories,
            size,
            color,
          };
          updateProduct(productId, product, dispatch);
          setMessage("Updated successfully...");
        });
      }
    );
  };

  //* useEffect for stats

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get(
          "orders/income?productId=" + productId
        );
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();

    setData(product);
    setCategories(product.category);
    setSize(product.size);
    setColor(product.color);
  }, [productId, MONTHS, product]);

  //* onClick handlers
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategories = (e) => {
    setCategories(e.target.value.split(","));
  };

  const handleSize = (e) => {
    setSize(e.target.value.split(","));
  };

  const handleColor = (e) => {
    setColor(e.target.value.split(","));
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder={product.title}
            />
            <label>Product Description</label>
            <input
              onChange={handleChange}
              name="desc"
              type="text"
              placeholder={product.desc}
            />
            <label>Price</label>
            <input
              name="price"
              onChange={handleChange}
              type="text"
              placeholder={product.price}
            />
            <label>Categories</label>
            <input
              onChange={handleCategories}
              type="text"
              placeholder={product.categories.join(",")}
            />
            <label>Size</label>
            <input
              onChange={handleSize}
              type="text"
              placeholder={product.size.join(",")}
            />
            <label>Color</label>
            <input
              onChange={handleColor}
              type="text"
              placeholder={product.color.join(",")}
            />
            <label>In Stock</label>
            <select name="inStock" id="idStock" onChange={handleChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                src={
                  product.img ||
                  "https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                }
                alt=""
                className="productUploadImg"
              />
              <label for="file">
                <PublishIcon />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <span className="text-green-500 ">{message}</span>
            <button
              disabled={isFetching}
              onClick={handleUpdateProduct}
              className="productButton"
            >
              Update
            </button>
            {error && (
              <span className="text-red-500 ">Something Went Wrong...</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Product;
