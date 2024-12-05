import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BlogList from "./BlogList";
import useGetBlog from "../../hooks/useGetBlog";

function Blogs() {
    const { loading, blogs } = useGetBlog();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("all");

    // Filtered blogs based on search term and filter option
    const filteredBlogs = blogs.filter((blog) => {
        if (filterOption === "all") {
            return blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return blog.category === filterOption && blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    return (
        <div className="w-screen h-auto min-h-[95vh] px-10 py-10 flex flex-col justify-start items-center gap-4 md:flex-row md:flex-wrap md:justify-start md:gap-10 lg:justify-center">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search Blogs"
                className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Select */}
            <select
                className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
            >
                <option value="all">All Categories</option>
                {/* Assuming categories are available in blogs data */}
                {blogs.map((blog) => (
                    <option key={blog.id} value={blog.category}>
                        {blog.category}
                    </option>
                ))}
            </select>

            {/* Blog List */}
            <div className="flex flex-col justify-start items-center gap-4 md:flex-row md:flex-wrap md:justify-start md:gap-10 lg:w-[1124px]">
                {loading ? (
                    <span className="loading loading-spinner w-20 mx-auto"></span>
                ) : (
                    filteredBlogs.map((blog, index) => <BlogList key={index} blog={blog} />)
                )}
            </div>
        </div>
    );
}

export default Blogs;
