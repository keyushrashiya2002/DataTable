import React, { useEffect, useState } from "react";

// Components
import DataTable from "react-data-table-component";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import Loading from "../Components/Loading";

// UI elements
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

// Redux Stroe
import { getProduct } from "../store/product/thunk";
import { useDispatch, useSelector } from "react-redux";
import { clearProductFilter, setProductFilter } from "../store/product/slice";

const getMomentDate = (date, format) => {
  return moment(date).format(format ? format : "DD/MM/YYYY");
};

const Table = () => {
  const dispatch = useDispatch();
  const [filterChanged, setFilterChanged] = useState(false);

  const data = useSelector((state) => state.Product.data);
  const loading = useSelector((state) => state.Product.loading);
  const filter = useSelector((state) => state.Product.filter);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const handleFilter = (input) => {
    const { name, value } = input.target;
    dispatch(setProductFilter({ [name]: value }));
    setFilterChanged(true);
  };

  useEffect(() => {
    let delayDebounceFn;
    if (filterChanged) {
      delayDebounceFn = setTimeout(() => {
        dispatch(getProduct());
      }, 500);
    }

    return () => clearTimeout(delayDebounceFn);
  }, [filter, filterChanged]);

  const handleDateFilter = (value) => {
    const [from, to] = value;
    if (from && to) {
      setFilterChanged(true);
      dispatch(
        setProductFilter({
          from: getMomentDate(from, "YYYY-MM-DD"),
          to: getMomentDate(to, "YYYY-MM-DD"),
        })
      );
    }
  };
  const clearFilter = () => {
    dispatch(clearProductFilter());
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">SKU</span>,
      selector: (row) => row.sku,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Category</span>,
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Description</span>,
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Launch Date</span>,
      selector: (row) => row.launchDate,
      sortable: true,
    },
  ];

  return (
    <>
      <Container>
        <Card className={"mt-5"}>
          <CardHeader>
            <Row className="justify-content-between align-items-center">
              <Col lg={3} className="mb-lg-0 mb-2 text-center text-lg-start">
                <h3 className="mb-0">Products</h3>
              </Col>
              <Col
                lg={7}
                className="d-flex align-items-center justify-content-end">
                <div className="search-box me-1">
                  <Input
                    type="select"
                    className="search"
                    name="category"
                    value={filter.category}
                    placeholder="Search here.."
                    onChange={handleFilter}>
                    <option disabled value="">
                      category
                    </option>
                    <option value={""}>All Category</option>
                    <option value={"Diamond"}>Diamond</option>
                    <option value={"Silver"}>Silver</option>
                    <option value={"Gold"}>Gold</option>
                    <option value={"Silver"}>Silver</option>
                  </Input>
                </div>
                <div className="search-box me-1">
                  <Input
                    type="text"
                    className="search"
                    name="text"
                    value={filter.text}
                    placeholder="Search here.."
                    onChange={handleFilter}
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>

                <div className="input-group d-flex me-1">
                  <Flatpickr
                    className="form-control  dash-filter-picker "
                    options={{
                      mode: "range",
                      dateFormat: "d M, Y",
                      defaultDate: [
                        getMomentDate(filter.from, "DD MMM YYYY"),
                        getMomentDate(filter.to, "DD MMM YYYY"),
                      ],
                    }}
                    onChange={handleDateFilter}
                  />
                </div>
                {Object.keys(filter).length !== 0 && (
                  <Button
                    color="danger"
                    disabled={loading}
                    onClick={clearFilter}>
                    Clear
                  </Button>
                )}
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="p-0">
            <DataTable
              columns={columns}
              data={data}
              pagination
              progressPending={loading}
              progressComponent={<Loading />}
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Table;
