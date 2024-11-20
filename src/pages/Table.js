import React, { useEffect, useRef, useState } from "react";

// Components
import DataTable from "react-data-table-component";
import Flatpickr from "react-flatpickr";
import moment from "moment";

import Select from "react-select";

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
import Loading from "../Components/Loading";
import NoData from "../Components/NoData";

const getMomentDate = (date, format) => {
  return moment(date).format(format ? format : "DD/MM/YYYY");
};

const Table = () => {
  const dispatch = useDispatch();
  const flatpickrRef = useRef(null);
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
    flatpickrRef.current.flatpickr.clear();
  };

  const columns = [
    {
      name: <span className="font-weight-bold text-muted fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold text-muted fs-13">SKU</span>,
      selector: (row) => row.sku,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold text-muted fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold text-muted fs-13">Category</span>,
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold text-muted fs-13">Description</span>
      ),
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold text-muted fs-13">Launch Date</span>
      ),
      selector: (row) => row.launchDate,
      sortable: true,
    },
  ];

  const options = [
    { value: "", label: "All Category" },
    { value: "Diamond", label: "Diamond" },
    { value: "Silver", label: "Silver" },
    { value: "Gold", label: "Gold" },
  ];

  return (
    <>
      <Container>
        <Card className={"mt-4"}>
          <CardHeader>
            <Row className="justify-content-between align-items-center">
              <Col
                lg={2}
                xl={3}
                className="mb-lg-0 mb-3 text-center text-lg-start">
                <h4 className="mb-0">Products</h4>
              </Col>
              <Col
                lg={10}
                xl={8}
                className="d-flex align-items-center justify-content-xl-end justify-content-center">
                <Row className={"align-items-center w-100"}>
                  <Col lg={4} sm={6}>
                    <div className="search-box">
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
                  </Col>
                  <Col lg={3} sm={6} className={"mt-sm-0 mt-2"}>
                    <div className="search-box">
                      <Select
                        className=""
                        value={options.find(
                          (item) => item.value === filter.category
                        )}
                        onChange={(data) => {
                          dispatch(setProductFilter({ category: data.value }));
                          setFilterChanged(true);
                        }}
                        options={options}
                      />
                    </div>
                  </Col>
                  <Col
                    lg={5}
                    sm={12}
                    className={"d-flex align-items-center mt-lg-0 mt-2"}>
                    <Flatpickr
                      ref={flatpickrRef}
                      className="form-control w-100  dash-filter-picker "
                      options={{
                        mode: "range",
                        dateFormat: "d M, Y",
                      }}
                      placeholder="Select Date"
                      onChange={handleDateFilter}
                    />
                    {Object.values(filter).filter((item) => item !== "")
                      .length !== 0 && (
                      <Button
                        color="danger"
                        className={"ms-2"}
                        disabled={loading}
                        onClick={clearFilter}>
                        Clear
                      </Button>
                    )}
                  </Col>
                </Row>
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
              noDataComponent={<NoData />}
              sortIcon={
                <div>
                  {/* <i className="ri-sort-asc "></i> */}
                  <i className="ri-arrow-up-s-line "></i>
                  <i className="ri-arrow-down-s-line "></i>
                </div>
              }
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Table;
